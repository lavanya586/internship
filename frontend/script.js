const API_URL = 'http://127.0.0.1:8000'; 

// 1. Security Check
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "login.html"; 
    } else {
        loadProjects(); 
        setupSearch(); 
    }
});

// 2. Logout
function logout() {
    localStorage.removeItem('token'); 
    window.location.href = "login.html";
}

// 3. Load Projects with Edit & Delete Buttons
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error('Backend response error');
        
        const projects = await response.json();
        const tableBody = document.getElementById('projectTableBody');
        tableBody.innerHTML = ''; 

        projects.forEach(project => {
            let badgeStyle = "background:#f5f5f5; color:#757575;"; 
            if (project.status === "Completed") {
                badgeStyle = "background:#e3f2fd; color:#1976d2;"; 
            } else if (project.status === "In Progress") {
                badgeStyle = "background:#fff3e0; color:#f57c00;"; 
            }

            // Corrected row template with project.name
            const row = `
                <tr>
                    <td style="padding: 12px;">${project.name || 'N/A'}</td>
                    <td>${project.division || 'N/A'}</td>
                    <td>
                        <span style="${badgeStyle} padding:4px 8px; border-radius:4px; font-size:11px; font-weight:500;">
                            ${project.status || 'Pending'}
                        </span>
                    </td>
                    <td>
                        <button style="color:#1976d2; border:none; background:none; cursor:pointer; font-weight:bold; margin-right:10px;" 
                                onclick="editProjectStatus('${project.name}')">Edit</button>
                        <button style="color:red; border:none; background:none; cursor:pointer; font-weight:bold;" 
                                onclick="deleteProject('${project.name}')">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // Stats Update
        document.getElementById('totalCount').innerText = projects.length;
        document.getElementById('completedCount').innerText = projects.filter(p => p.status === 'Completed').length;
        document.getElementById('progressCount').innerText = projects.filter(p => p.status === 'In Progress').length;

    } catch (error) {
        console.error("Data fetch error:", error);
    }
}

// 4. Update Status Logic (PUT)
async function editProjectStatus(projectName) {
    const newStatus = prompt("Enter new status (Completed / In Progress / Pending):");
    if (!newStatus) return;

    try {
        const response = await fetch(`${API_URL}/update-project-status/${projectName}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            alert("Status Updated! ✨");
            loadProjects(); 
        } else {
            alert("Update failed!");
        }
    } catch (error) {
        alert("Server error!");
    }
}

// 5. Delete Logic (DELETE)
async function deleteProject(projectName) {
    if (!confirm(`Are you sure you want to delete "${projectName}"?`)) return;

    try {
        const response = await fetch(`${API_URL}/delete-project/${projectName}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Project Deleted Successfully! 🗑️");
            loadProjects(); 
        } else {
            alert("Failed to delete project!");
        }
    } catch (error) {
        alert("Server error during deletion!");
    }
}

// 6. Search Filter
function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#projectTableBody tr');
            rows.forEach(row => {
                const name = row.querySelector('td').innerText.toLowerCase();
                row.style.display = name.includes(term) ? '' : 'none';
            });
        });
    }
}

// 7. Create Project Logic
document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const projectData = {
        name: document.getElementById('projectName').value,
        division: document.getElementById('division').value,
        type: document.getElementById('projectType').value,
        status: document.getElementById('status').value,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch(`${API_URL}/create-project`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });

        if (response.ok) {
            alert("Project Created! 🔥");
            loadProjects(); 
            e.target.reset();
        }
    } catch (error) {
        alert("Server connection failed!");
    }
});