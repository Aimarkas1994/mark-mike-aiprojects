// Main portfolio JavaScript with API integration
document.addEventListener('DOMContentLoaded', function() {
    // Load API client
    const script = document.createElement('script');
    script.src = 'js/api-client.js';
    script.onload = initializePortfolio;
    document.head.appendChild(script);
});

function initializePortfolio() {
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });

    // Initialize dynamic content
    loadSkills();
    loadProjects();
    initializeContactForm();
    loadGitHubData();
}

// Load skills from API
async function loadSkills() {
    try {
        const skills = await window.portfolioAPI.getSkills();
        const skillsContainer = document.querySelector('.skills-grid');
        
        if (skillsContainer && skills.length > 0) {
            // Group skills by category
            const skillsByCategory = {};
            skills.forEach(skill => {
                if (!skillsByCategory[skill.category]) {
                    skillsByCategory[skill.category] = [];
                }
                skillsByCategory[skill.category].push(skill);
            });

            // Clear existing static content
            skillsContainer.innerHTML = '';

            // Create dynamic skill categories
            Object.keys(skillsByCategory).forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'skill-category';
                
                const title = document.createElement('h3');
                title.textContent = category;
                categoryDiv.appendChild(title);
                
                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'skill-tags';
                
                skillsByCategory[category].forEach(skill => {
                    const tag = document.createElement('span');
                    tag.className = 'skill-tag';
                    tag.textContent = skill.name;
                    if (skill.proficiency_level) {
                        tag.title = `Proficiency: ${skill.proficiency_level}/5`;
                    }
                    tagsDiv.appendChild(tag);
                });
                
                categoryDiv.appendChild(tagsDiv);
                skillsContainer.appendChild(categoryDiv);
            });
        }
    } catch (error) {
        console.error('Error loading skills:', error);
        // Keep static content as fallback
    }
}

// Load projects from API
async function loadProjects() {
    try {
        const projects = await window.portfolioAPI.getProjects();
        const projectsContainer = document.getElementById('projects-container');
        
        if (projectsContainer && projects.length > 0) {
            projectsContainer.innerHTML = '';
            
            projects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsContainer.appendChild(projectCard);
            });
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        // Keep static content or show error
        const projectsContainer = document.getElementById('projects-container');
        if (projectsContainer) {
            projectsContainer.innerHTML = '<p class="error">Unable to load projects. Please try again later.</p>';
        }
    }
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const image = project.image_url || 'https://via.placeholder.com/400x250?text=Project+Image';
    
    card.innerHTML = `
        <div class="project-image">
            <img src="${image}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/400x250?text=Project+Image'">
        </div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tech">
                ${project.technologies ? project.technologies.split(',').map(tech => 
                    `<span class="tech-tag">${tech.trim()}</span>`
                ).join('') : ''}
            </div>
            <div class="project-links">
                ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="project-link">GitHub</a>` : ''}
                ${project.live_url ? `<a href="${project.live_url}" target="_blank" class="project-link">Live Demo</a>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: '',
                message: document.getElementById('message').value
            };
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            try {
                const response = await window.portfolioAPI.submitContactForm(formData);
                
                // Show success message
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } catch (error) {
                console.error('Error sending message:', error);
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                // Restore button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Load GitHub data
async function loadGitHubData() {
    try {
        const response = await fetch('https://api.github.com/users/Aimarkas1994');
        const userData = await response.json();
        
        // Update GitHub stats
        const statsContainer = document.getElementById('github-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-item">
                    <h4>${userData.public_repos}</h4>
                    <span>Repositories</span>
                </div>
                <div class="stat-item">
                    <h4>${userData.followers}</h4>
                    <span>Followers</span>
                </div>
                <div class="stat-item">
                    <h4>${userData.following}</h4>
                    <span>Following</span>
                </div>
            `;
        }
        
        // Load repositories
        const reposResponse = await fetch('https://api.github.com/users/Aimarkas1994/repos?sort=created&per_page=6');
        const repos = await reposResponse.json();
        
        const reposContainer = document.getElementById('github-repos');
        if (reposContainer) {
            reposContainer.innerHTML = repos.map(repo => `
                <div class="repo-card">
                    <h4>${repo.name}</h4>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="repo-stats">
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>🍴 ${repo.forks_count}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="repo-link">View Repository</a>
                </div>
            `).join('');
        }
        
    } catch (error) {
        console.error('Error loading GitHub data:', error);
        // Keep static content or show error
        const githubStats = document.getElementById('github-stats');
        if (githubStats) {
            githubStats.innerHTML = '<p>Unable to load GitHub data.</p>';
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .project-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s ease;
    }
    
    .project-card:hover {
        transform: translateY(-5px);
    }
    
    .project-image img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
    
    .project-content {
        padding: 20px;
    }
    
    .project-tech {
        margin: 10px 0;
    }
    
    .tech-tag {
        background: #f0f0f0;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8em;
        margin-right: 5px;
        margin-bottom: 5px;
        display: inline-block;
    }
    
    .project-links {
        margin-top: 15px;
    }
    
    .project-link {
        background: #007bff;
        color: white;
        padding: 8px 15px;
        border-radius: 4px;
        text-decoration: none;
        margin-right: 10px;
        font-size: 0.9em;
    }
    
    .project-link:hover {
        background: #0056b3;
    }
    
    .notification {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
`;
document.head.appendChild(style);