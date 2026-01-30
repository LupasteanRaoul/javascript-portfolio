// Portfolio Data - Modifică căile pentru structura ta
const portfolioProjects = [
    {
        id: 1,
        title: "Shopping Cart",
        description: "A fully functional e-commerce shopping cart with local storage persistence, product filtering, and real-time calculations.",
        icon: "fas fa-shopping-cart",
        technologies: ["HTML", "CSS", "JavaScript", "Local Storage"],
        demoLink: "./shopping-cart/index.html",  // Schimbat aici!
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/shopping-cart"
    },
    {
        id: 2,
        title: "Sorting Visualizer",
        description: "Interactive sorting algorithm visualization with multiple algorithms, step-by-step execution, and performance metrics.",
        icon: "fas fa-sort-amount-down",
        technologies: ["HTML", "CSS", "JavaScript", "Algorithms"],
        demoLink: "./sorting-visualizer/index.html",  // Schimbat aici!
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/sorting-visualizer"
    },
    {
        id: 3,
        title: "Rock Paper Scissors Arena",
        description: "Classic game with modern UI, win tracking, statistics, and multiple gameplay modes including auto-play.",
        icon: "fas fa-hand-rock",
        technologies: ["HTML", "CSS", "JavaScript", "Game Logic"],
        demoLink: "./minigame/index.html",  // Schimbat aici!
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/minigame"
    },
    {
        id: 4,
        title: "Music Player",
        description: "Audio player with playlist management, progress bar, volume control, and visualizations.",
        icon: "fas fa-music",
        technologies: ["HTML", "CSS", "JavaScript", "Audio API"],
        demoLink: "./music-player/index.html",  // Schimbat aici!
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/music-player"
    },
    {
        id: 5,
        title: "Weather App",
        description: "Weather forecast application with location detection, temperature units, and animated weather icons.",
        icon: "fas fa-cloud-sun",
        technologies: ["HTML", "CSS", "JavaScript", "API Integration"],
        demoLink: "./weather-app/index.html",  // Schimbat aici!
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/weather-app"
    },
    {
        id: 6,
        title: "Todo App",
        description: "Task management application with CRUD operations, filtering, and local storage persistence.",
        icon: "fas fa-tasks",
        technologies: ["HTML", "CSS", "JavaScript", "CRUD"],
        demoLink: "./todo-app/index.html",  // Schimbat aici!
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/todo-app"
    },
    {
        id: 7,
        title: "Drum Machine",
        description: "Interactive drum pad with multiple sound kits, recording, and playback functionality.",
        icon: "fas fa-drum",
        technologies: ["HTML", "CSS", "JavaScript", "Audio"],
        demoLink: "./drum-machine/index.html",  // Schimbat aici!
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/drum-machine"
    },
    {
        id: 8,
        title: "Customer Form",
        description: "Form validation with real-time feedback, custom inputs, and submission handling.",
        icon: "fas fa-user-edit",
        technologies: ["HTML", "CSS", "JavaScript", "Form Validation"],
        demoLink: "./customer-form/index.html",  // Schimbat aici!
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/customer-form"
    },
    {
        id: 9,
        title: "Bookmark Manager",
        description: "Bookmark organizer with categories, search functionality, and export options.",
        icon: "fas fa-bookmark",
        technologies: ["HTML", "CSS", "JavaScript", "Local Storage"],
        demoLink: "./bookmark-manager/index.html",  // Schimbat aici!
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/bookmark-manager"
    },
    {
        id: 10,
        title: "Forum Leaderboard",
        description: "User ranking system with sorting, filtering, and achievement badges.",
        icon: "fas fa-trophy",
        technologies: ["HTML", "CSS", "JavaScript", "Data Sorting"],
        demoLink: "./forum-leaderboard/index.html",  // Schimbat aici!
        githubLink: "https://github.com/LupasteanRaoul/javascript-portfolio/tree/main/forum-leaderboard"
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
    checkProjectAvailability();
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
                <a href="${project.demoLink}" class="project-link demo" target="_blank" id="demo-${project.id}">
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

// Check if projects exist
async function checkProjectAvailability() {
    for (const project of portfolioProjects) {
        try {
            const response = await fetch(project.demoLink, { method: 'HEAD' });
            const demoLink = document.getElementById(`demo-${project.id}`);
            
            if (!response.ok) {
                // Proiectul nu există - dezactivează butonul
                if (demoLink) {
                    demoLink.style.opacity = '0.6';
                    demoLink.style.cursor = 'not-allowed';
                    demoLink.onclick = (e) => {
                        e.preventDefault();
                        alert(`Project "${project.title}" is not available yet. Please check back soon!`);
                    };
                }
            }
        } catch (error) {
            console.log(`Project ${project.title} not available:`, error);
        }
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
    
    // Add hover effect to project cards
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.project-card')) {
            const card = e.target.closest('.project-card');
            card.style.transform = 'translateY(-5px)';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.project-card')) {
            const card = e.target.closest('.project-card');
            card.style.transform = 'translateY(0)';
        }
    });
}

// Add CSS for project status
const style = document.createElement('style');
style.textContent = `
    .project-link.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
    }
    
    .project-status {
        display: inline-block;
        font-size: 0.7rem;
        padding: 2px 8px;
        border-radius: 12px;
        margin-left: 8px;
        background: #f59e0b;
        color: white;
    }
    
    .project-status.available {
        background: #10b981;
    }
    
    .project-status.unavailable {
        background: #ef4444;
    }
`;
document.head.appendChild(style);
