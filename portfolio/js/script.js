// Portfolio JavaScript - Professional Website Functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // GitHub API Integration
    class GitHubAPI {
        constructor() {
            this.username = 'Aimarkas1994';
            this.baseUrl = 'https://api.github.com';
            this.cache = new Map();
            this.cacheExpiry = 10 * 60 * 1000; // 10 minutes
        }

        async fetch(endpoint) {
            const cacheKey = endpoint;
            const now = Date.now();

            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (now - cached.timestamp < this.cacheExpiry) {
                    return cached.data;
                }
            }

            try {
                const response = await fetch(`${this.baseUrl}${endpoint}`);
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                
                this.cache.set(cacheKey, {
                    data,
                    timestamp: now
                });

                return data;
            } catch (error) {
                console.error('GitHub API Error:', error);
                return null;
            }
        }

        async getUser() {
            return this.fetch(`/users/${this.username}`);
        }

        async getRepos(perPage = 6) {
            return this.fetch(`/users/${this.username}/repos?sort=created&direction=desc&per_page=${perPage}`);
        }
    }

    const githubAPI = new GitHubAPI();

    // Load GitHub Data
    async function loadGitHubData() {
        try {
            // Load user stats
            const user = await githubAPI.getUser();
            if (user) {
                displayGitHubStats(user);
            }

            // Load repositories
            const repos = await githubAPI.getRepos();
            if (repos) {
                displayGitHubRepos(repos);
            }
        } catch (error) {
            console.error('Error loading GitHub data:', error);
            displayError();
        }
    }

    // Display GitHub Statistics
    function displayGitHubStats(user) {
        const statsContainer = document.getElementById('github-stats');
        if (!statsContainer) return;

        const stats = [
            {
                label: 'Public Repos',
                value: user.public_repos,
                icon: 'fas fa-code-branch'
            },
            {
                label: 'Followers',
                value: user.followers,
                icon: 'fas fa-users'
            },
            {
                label: 'Following',
                value: user.following,
                icon: 'fas fa-user-plus'
            },
            {
                label: 'Gists',
                value: user.public_gists,
                icon: 'fas fa-file-code'
            }
        ];

        statsContainer.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <i class="${stat.icon}"></i>
                <span class="stat-number">${stat.value}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        `).join('');
    }

    // Display GitHub Repositories
    function displayGitHubRepos(repos) {
        const reposContainer = document.getElementById('github-repos');
        if (!reposContainer) return;

        reposContainer.innerHTML = repos.map(repo => `
            <div class="repo-card">
                <h3 class="repo-name">${repo.name}</h3>
                <p class="repo-description">${repo.description || 'No description available'}</p>
                <div class="repo-stats">
                    <span class="repo-stat">
                        <i class="fas fa-circle" style="color: ${repo.language ? getLanguageColor(repo.language) : '#6e7681'}"></i>
                        ${repo.language || 'Unknown'}
                    </span>
                    <span class="repo-stat">
                        <i class="fas fa-star"></i>
                        ${repo.stargazers_count}
                    </span>
                    <span class="repo-stat">
                        <i class="fas fa-code-branch"></i>
                        ${repo.forks_count}
                    </span>
                </div>
                <a href="${repo.html_url}" target="_blank" class="repo-link">
                    <i class="fas fa-external-link-alt"></i>
                    View Repository
                </a>
            </div>
        `).join('');
    }

    // Get language color for repository
    function getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'TypeScript': '#2b7489',
            'PHP': '#4F5D95',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'Rust': '#dea584',
            'Shell': '#89e051',
            'Vue': '#2c3e50',
            'React': '#61dafb',
            'Angular': '#dd0031',
            'Svelte': '#ff3e00',
            'Node.js': '#339933'
        };

        return colors[language] || '#6e7681';
    }

    // Display error message
    function displayError() {
        const statsContainer = document.getElementById('github-stats');
        const reposContainer = document.getElementById('github-repos');

        if (statsContainer) {
            statsContainer.innerHTML = '<p>Unable to load GitHub data. Please try again later.</p>';
        }

        if (reposContainer) {
            reposContainer.innerHTML = '<p>Unable to load repositories. Please try again later.</p>';
        }
    }

    // Load Projects (placeholder projects)
    function loadProjects() {
        const projectsContainer = document.getElementById('projects-container');
        if (!projectsContainer) return;

        const projects = [
            {
                title: 'Portfolio Website',
                description: 'Professional portfolio website built with HTML, CSS, and JavaScript. Features responsive design and GitHub integration.',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'GitHub API'],
                githubUrl: 'https://github.com/Aimarkas1994/mark-mike-aiprojects',
                liveUrl: '#'
            },
            {
                title: 'Full Stack Application',
                description: 'A comprehensive full-stack web application with modern architecture and best practices.',
                technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
                githubUrl: '#',
                liveUrl: '#'
            },
            {
                title: 'AI Integration Project',
                description: 'Exploring artificial intelligence integration with web applications and modern APIs.',
                technologies: ['Python', 'OpenAI', 'API Integration', 'Machine Learning'],
                githubUrl: '#',
                liveUrl: '#'
            }
        ];

        projectsContainer.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="project-image">
                    <i class="fas fa-project-diagram"></i>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.githubUrl !== '#' ? 
                            `<a href="${project.githubUrl}" target="_blank" class="project-link">
                                <i class="fab fa-github"></i> GitHub
                            </a>` : ''
                        }
                        ${project.liveUrl !== '#' ? 
                            `<a href="${project.liveUrl}" target="_blank" class="project-link">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>` : ''
                        }
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Here you would normally send the data to your backend
            // For now, we'll just show a success message
            showContactMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        });
    }

    // Show contact form message
    function showContactMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `contact-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 5000);
    }

    // Add CSS for contact message animations
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
    `;
    document.head.appendChild(style);

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.addEventListener('DOMContentLoaded', function() {
        const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat-card, .repo-card');
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    });

    // Initialize all functionality
    function initializeApp() {
        loadGitHubData();
        loadProjects();
    }

    // Start the application
    initializeApp();

    // Lazy loading for better performance
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        // Observe images for lazy loading
        document.querySelectorAll('img').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function() {
            // Handle scroll events here
        });
    });

    // Error handling for external resources
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMyMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgODBIMjAwVjEyMEgxMjBWODBaIiBmaWxsPSIjOUI0RkZGIi8+CjxwYXRoIGQ9Ik0xNDAgMTAwSDE4MFYxMDFIMTQwVjEwMFoiIGZpbGw9IiM5QjRGNEYiLz4KPC9zdmc+';
        }
    }, true);
});

// Export functions for potential use in other modules
window.PortfolioApp = {
    GitHubAPI,
    loadGitHubData,
    displayGitHubStats,
    displayGitHubRepos
};