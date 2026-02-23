const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); 


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sales_db'
});

db.connect(err => {
    if (err) {
        console.error('The database is not connecting:', err);
    } else {
        console.log('Database connected successfully!');
    }
});


app.get('/api/report', (req, res) => {
    
    const sql = `
        SELECT 
            DATE(s.sale_time) as date,
            HOUR(s.sale_time) as hour, 
            p.product_name as product, 
            s.quantity as qty, 
            pp.price, 
            s.tax as tax_amount, 
            ((s.tax / (s.quantity * pp.price)) * 100) as tax_percent, 
            (s.quantity * pp.price + s.tax) as final_total
        FROM sales s
        JOIN products p ON s.product_id = p.product_id
        JOIN product_price pp ON p.product_id = pp.product_id
        ORDER BY date DESC, hour ASC;
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);

       
        const reportData = {};
        results.forEach(row => {
            if (!reportData[row.date]) reportData[row.date] = {};
            if (!reportData[row.date][row.hour]) reportData[row.date][row.hour] = [];
            reportData[row.date][row.hour].push(row);
        });

        res.json(reportData);
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});