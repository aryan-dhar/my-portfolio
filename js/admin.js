document.addEventListener('DOMContentLoaded', function() {
    const adminTrigger = document.getElementById('admin-trigger');
    const adminModal = document.getElementById('admin-modal');
    const closeBtn = adminModal.querySelector('.close');
    const adminLogin = document.getElementById('admin-login');
    const adminPanel = document.getElementById('admin-panel');
    const loginBtn = document.getElementById('login-btn');
    const addProjectBtn = document.getElementById('add-project-btn');
    const projectForm = document.getElementById('project-form');
    const submitProjectBtn = document.getElementById('submit-project');

    // Secret button click handler
    let clicks = 0;
    adminTrigger.addEventListener('click', () => {
        clicks++;
        if (clicks === 3) { // Show modal after 3 clicks
            adminModal.style.display = 'block';
            clicks = 0;
        }
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        adminModal.style.display = 'none';
        adminLogin.style.display = 'block';
        adminPanel.style.display = 'none';
        projectForm.style.display = 'none';
    });

    // Login handler
    loginBtn.addEventListener('click', async () => {
        const password = document.getElementById('admin-password').value;
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });
            
            if (response.ok) {
                adminLogin.style.display = 'none';
                adminPanel.style.display = 'block';
                loadExistingProjects();
            } else {
                alert('Invalid password');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        }
    });

    // Show project form
    addProjectBtn.addEventListener('click', () => {
        projectForm.style.display = 'block';
    });

    // Submit new project
    submitProjectBtn.addEventListener('click', async () => {
        const projectData = {
            title: document.getElementById('project-title').value,
            description: document.getElementById('project-description').value,
            link: document.getElementById('project-link').value,
            imageUrl: document.getElementById('project-image').value,
        };

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });

            if (response.ok) {
                alert('Project added successfully!');
                projectForm.style.display = 'none';
                loadExistingProjects();
                location.reload(); // Reload page to show new project
            } else {
                alert('Failed to add project');
            }
        } catch (error) {
            console.error('Error adding project:', error);
            alert('Failed to add project');
        }
    });

    // Load existing projects
    async function loadExistingProjects() {
        try {
            const response = await fetch('/api/projects');
            const projects = await response.json();
            const container = document.getElementById('existing-projects');
            
            container.innerHTML = '<h3>Existing Projects</h3>';
            projects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.className = 'project-item';
                projectElement.innerHTML = `
                    <h4>${project.title}</h4>
                    <button class="delete-project" data-id="${project._id}">Delete</button>
                `;
                container.appendChild(projectElement);
            });

            // Add delete handlers
            document.querySelectorAll('.delete-project').forEach(button => {
                button.addEventListener('click', async (e) => {
                    if (confirm('Are you sure you want to delete this project?')) {
                        const projectId = e.target.dataset.id;
                        try {
                            const response = await fetch(`/api/projects/${projectId}`, {
                                method: 'DELETE',
                            });
                            if (response.ok) {
                                e.target.parentElement.remove();
                                location.reload(); // Reload page to update projects
                            }
                        } catch (error) {
                            console.error('Error deleting project:', error);
                            alert('Failed to delete project');
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }
}); 