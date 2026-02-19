document.addEventListener('DOMContentLoaded', () => {
    const regForm = document.getElementById('registerForm');

    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword')?.value;

            // Password match validation
            if (confirmPassword && password !== confirmPassword) {
                alert("❌ Passwords do not match!");
                return;
            }

            try {
                // Fetch request with full URL and CORS mode for backend communication
                const response = await fetch("http://127.0.0.1:8000/register", {
                    method: "POST",
                    mode: 'cors', // Helps with direct file access connectivity
                    headers: { 
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify({ 
                        email: email, 
                        password: password 
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("✅ " + (data.message || "Registration Successful!"));
                    window.location.href = "login.html";
                } else {
                    // Display error details returned from the backend
                    alert("❌ Error: " + (data.detail || "Something went wrong"));
                }
            } catch (error) {
                console.error("Fetch error:", error);
                // Alert displayed if the backend server is unreachable
                alert("🚨 Cannot connect to the server! Please check if the backend terminal is running.");
            }
        });
    }
});