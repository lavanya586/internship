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
            // Backend-la irundhu varra real JWT token-a save panrom
            localStorage.setItem('token', data.access_token);
            
            alert("Login Success! 🔥");
            window.location.href = "index.html"; // Dashboard-ku pogudhu
        } else {
            const error = await response.json();
            alert(error.detail || "Invalid Email or Password!");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Server connection failed!");
    }
});