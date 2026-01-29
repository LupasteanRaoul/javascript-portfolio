// Portfolio Data
const portfolioProjects = [
    {
        id: 1,
        title: "Shopping Cart",
        description: "A fully functional e-commerce shopping cart with local storage persistence, product filtering, and real-time calculations.",
        icon: "fas fa-shopping-cart",
        technologies: ["HTML", "CSS", "JavaScript", "Local Storage"],
        demoLink: "projects/01-shopping-cart/index.html",
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/projects/01-shopping-cart"
    },
    {
        id: 2,
        title: "Algorithm Visualizer",
        description: "Interactive sorting algorithm visualization with multiple algorithms, step-by-step execution, and performance metrics.",
        icon: "fas fa-sort-amount-down",
        technologies: ["HTML", "CSS", "JavaScript", "Algorithms"],
        demoLink: "projects/02-sorting-visualizer/index.html",
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/projects/02-sorting-visualizer"
    },
    {
        id: 3,
        title: "Rock Paper Scissors Arena",
        description: "Classic game with modern UI, win tracking, statistics, and multiple gameplay modes including auto-play.",
        icon: "fas fa-hand-rock",
        technologies: ["HTML", "CSS", "JavaScript", "Game Logic"],
        demoLink: "projects/03-minigame/index.html",
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/projects/03-minigame"
    },
    {
        id: 4,
        title: "Music Player",
        description: "Audio player with playlist management, progress bar, volume control, and visualizations.",
        icon: "fas fa-music",
        technologies: ["HTML", "CSS", "JavaScript", "Audio API"],
        demoLink: "projects/04-music-player/index.html",
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/projects/04-music-player"
    },
    {
        id: 5,
        title: "Weather App",
        description: "Weather forecast application with location detection, temperature units, and animated weather icons.",
        icon: "fas fa-cloud-sun",
        technologies: ["HTML", "CSS", "JavaScript", "API Integration"],
        demoLink: "projects/05-weather-app/index.html",
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/projects/05-weather-app"
    },
    {
        id: 6,
        title: "Todo App",
        description: "Task management application with CRUD operations, filtering, and local storage persistence.",
        icon: "fas fa-tasks",
        technologies: ["HTML", "CSS", "JavaScript", "CRUD"],
        demoLink: "projects/06-todo-app/index.html",
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/projects/06-todo-app"
    },
    {
        id: 7,
        title: "Drum Machine",
        description: "Interactive drum pad with multiple sound kits, recording, and playback functionality.",
        icon: "fas fa-drum",
        technologies: ["HTML", "CSS", "JavaScript", "Audio"],
        demoLink: "projects/07-drum-machine/index.html",
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/projects/07-drum-machine"
    },
    {
        id: 8,
        title: "Customer Form",
        description: "Form validation with real-time feedback, custom inputs, and submission handling.",
        icon: "fas fa-user-edit",
        technologies: ["HTML", "CSS", "JavaScript", "Form Validation"],
        demoLink: "projects/08-customer-form/index.html",
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/projects/08-customer-form"
    },
    {
        id: 9,
        title: "Bookmark Manager",
        description: "Bookmark organizer with categories, search functionality, and export options.",
        icon: "fas fa-bookmark",
        technologies: ["HTML", "CSS", "JavaScript", "Local Storage"],
        demoLink: "projects/09-bookmark-manager/index.html",
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/projects/09-bookmark-manager"
    },
    {
        id: 10,
        title: "Forum Leaderboard",
        description: "User ranking system with sorting, filtering, and achievement badges.",
        icon: "fas fa-trophy",
        technologies: ["HTML", "CSS", "JavaScript", "Data Sorting"],
        demoLink: "projects/10-forum-leaderboard/index.html",
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/projects/10-forum-leaderboard"
    }
];

// DOM Elements
const projectsGrid = document.getElementById('projects-grid');
const projectCountElement = document.getElementById('project-count');
const backToTopBtn = document.getElementById('back-to-top');

// Initialize Portfolio
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    setupEventListeners();
    updateProjectCount();
});

// Load Projects into Grid
function loadProjects() {
    projectsGrid.innerHTML = '';
    
    portfolioProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

// Create Project Card HTML
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <div class="project-header">
            <div class="project-number">${project.id}</div>
            <div class="project-icon">
                <i class="${project.icon}"></i>
            </div>
            <h3 class="project-title">${project.title}</h3>
        </div>
        <div class="project-body">
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${project.technologies.map(tech => 
                    `<span class="tech-tag">${tech}</span>`
                ).join('')}
            </div>
            <div class="project-footer">
                <a href="${project.demoLink}" class="project-link demo" target="_blank">
                    <i class="fas fa-eye"></i> Live Demo
                </a>
                <a href="${project.githubLink}" class="project-link" target="_blank">
                    <i class="fab fa-github"></i> Code
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Update Project Count
function updateProjectCount() {
    if (projectCountElement) {
        projectCountElement.textContent = portfolioProjects.length;
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Back to Top Button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Theme Toggle (optional)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            } else {
                icon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
            }
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            const icon = themeToggle.querySelector('i');
            icon.className = 'fas fa-sun';
        }
    }
}

// Add CSS for dark theme
const darkThemeCSS = `
    body.dark-theme {
        background-color: #1a1a1a;
        color: #ffffff;
    }
    
    body.dark-theme .navbar {
        background-color: #2d2d2d;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    body.dark-theme .project-card {
        background-color: #2d2d2d;
        border-color: #404040;
    }
    
    body.dark-theme .about-card {
        background-color: #2d2d2d;
    }
    
    body.dark-theme .tech-stack {
        background-color: #2d2d2d;
    }
    
    body.dark-theme .contact-item {
        background-color: #2d2d2d;
    }
    
    body.dark-theme .footer {
        background-color: #0d0d0d;
    }
`;

// Inject dark theme CSS
const style = document.createElement('style');
style.textContent = darkThemeCSS;
document.head.appendChild(style);
