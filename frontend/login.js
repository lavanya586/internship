const API_URL = 'http://127.0.0.1:8000';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
     
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            
            localStorage.setItem('token', data.access_token);
            
            alert("Login Successful! 🔥");
            
            window.location.href = "index.html"; 
        } else {
            const error = await response.json();
            alert(error.detail || "Invalid Email or Password!");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Server connection failed! Please check if the backend is running.");
    }
});