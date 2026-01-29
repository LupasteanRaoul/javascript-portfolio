class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todo-tasks')) || [];
        this.currentTask = null;
        this.isEditing = false;
        
        // DOM Elements
        this.elements = {
            tasksList: document.getElementById('tasks-list'),
            emptyState: document.getElementById('empty-state'),
            totalTasks: document.getElementById('total-tasks'),
            completedTasks: document.getElementById('completed-tasks'),
            pendingTasks: document.getElementById('pending-tasks'),
            searchInput: document.getElementById('search-input'),
            filterSelect: document.getElementById('filter-select'),
            sortSelect: document.getElementById('sort-select'),
            addTaskBtn: document.getElementById('add-task-btn'),
            taskModal: document.getElementById('task-modal'),
            closeModal: document.getElementById('close-modal'),
            cancelBtn: document.getElementById('cancel-btn'),
            taskForm: document.getElementById('task-form'),
            modalTitle: document.getElementById('modal-title'),
            taskTitle: document.getElementById('task-title'),
            taskDate: document.getElementById('task-date'),
            taskPriority: document.getElementById('task-priority'),
            taskDescription: document.getElementById('task-description'),
            taskCategory: document.getElementById('task-category'),
            saveTaskBtn: document.getElementById('save-task-btn'),
            notification: document.getElementById('notification'),
            notificationText: document.getElementById('notification-text'),
            clearCompleted: document.getElementById('clear-completed'),
            exportTasks: document.getElementById('export-tasks'),
            importTasks: document.getElementById('import-tasks')
        };

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        this.elements.taskDate.min = today;
        
        this.init();
    }

    init() {
        this.renderTasks();
        this.updateStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add task button
        this.elements.addTaskBtn.addEventListener('click', () => this.openModal());
        
        // Modal controls
        this.elements.closeModal.addEventListener('click', () => this.closeModal());
        this.elements.cancelBtn.addEventListener('click', () => this.closeModal());
        this.elements.taskModal.addEventListener('click', (e) => {
            if (e.target === this.elements.taskModal) this.closeModal();
        });
        
        // Form submission
        this.elements.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });
        
        // Search and filters
        this.elements.searchInput.addEventListener('input', () => this.renderTasks());
        this.elements.filterSelect.addEventListener('change', () => this.renderTasks());
        this.elements.sortSelect.addEventListener('change', () => this.renderTasks());
        
        // Quick actions
        this.elements.clearCompleted.addEventListener('click', () => this.clearCompleted());
        this.elements.exportTasks.addEventListener('click', () => this.exportTasks());
        this.elements.importTasks.addEventListener('click', () => this.importTasks());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.openModal();
            }
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getFilteredTasks() {
        let filtered = [...this.tasks];
        const searchTerm = this.elements.searchInput.value.toLowerCase();
        const filter = this.elements.filterSelect.value;
        const sort = this.elements.sortSelect.value;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchTerm) ||
                task.description.toLowerCase().includes(searchTerm) ||
                task.category.toLowerCase().includes(searchTerm)
            );
        }

        // Status filter
        switch (filter) {
            case 'pending':
                filtered = filtered.filter(task => !task.completed);
                break;
            case 'completed':
                filtered = filtered.filter(task => task.completed);
                break;
            case 'today':
                const today = new Date().toISOString().split('T')[0];
                filtered = filtered.filter(task => task.date === today);
                break;
            case 'overdue':
                const now = new Date();
                filtered = filtered.filter(task => 
                    task.date && 
                    !task.completed && 
                    new Date(task.date) < now
                );
                break;
        }

        // Sorting
        switch (sort) {
            case 'date-desc':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'date-asc':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
                break;
            case 'title':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        return filtered;
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            this.elements.emptyState.style.display = 'block';
            this.elements.tasksList.innerHTML = '';
        } else {
            this.elements.emptyState.style.display = 'none';
            this.elements.tasksList.innerHTML = filteredTasks.map(task => this.createTaskElement(task)).join('');
            
            // Add event listeners to newly created task elements
            filteredTasks.forEach(task => {
                const taskElement = document.getElementById(`task-${task.id}`);
                if (taskElement) {
                    taskElement.querySelector('.task-checkbox').addEventListener('click', () => this.toggleTask(task.id));
                    taskElement.querySelector('.edit-btn').addEventListener('click', () => this.editTask(task.id));
                    taskElement.querySelector('.delete-btn').addEventListener('click', () => this.deleteTask(task.id));
                }
            });
        }
        
        this.updateStats();
    }

    createTaskElement(task) {
        const isOverdue = task.date && !task.completed && new Date(task.date) < new Date();
        const dateClass = isOverdue ? 'overdue' : '';
        
        return `
            <div class="task-card ${task.completed ? 'completed' : ''} priority-${task.priority}" id="task-${task.id}">
                <div class="task-header">
                    <div class="task-title">
                        <div class="task-checkbox ${task.completed ? 'checked' : ''}">
                            ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                        </div>
                        ${task.title}
                    </div>
                    <div class="task-actions">
                        <button class="edit-btn" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                ${task.description ? `
                    <div class="task-description">
                        ${task.description}
                    </div>
                ` : ''}
                
                <div class="task-meta">
                    ${task.date ? `
                        <div class="task-date ${dateClass}">
                            <i class="far fa-calendar"></i>
                            ${new Date(task.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                            })}
                            ${isOverdue ? ' (Overdue)' : ''}
                        </div>
                    ` : ''}
                    
                    <div class="task-priority">
                        <i class="fas fa-flag"></i>
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </div>
                </div>
                
                ${task.category ? `
                    <span class="task-category">
                        ${task.category}
                    </span>
                ` : ''}
            </div>
        `;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        this.elements.totalTasks.textContent = total;
        this.elements.completedTasks.textContent = completed;
        this.elements.pendingTasks.textContent = pending;
    }

    openModal(task = null) {
        this.isEditing = !!task;
        this.currentTask = task;
        
        if (task) {
            this.elements.modalTitle.textContent = 'Edit Task';
            this.elements.taskTitle.value = task.title;
            this.elements.taskDate.value = task.date || '';
            this.elements.taskPriority.value = task.priority;
            this.elements.taskDescription.value = task.description || '';
            this.elements.taskCategory.value = task.category || 'personal';
        } else {
            this.elements.modalTitle.textContent = 'Add New Task';
            this.elements.taskForm.reset();
            const today = new Date().toISOString().split('T')[0];
            this.elements.taskDate.value = today;
        }
        
        this.elements.taskModal.classList.add('active');
        this.elements.taskTitle.focus();
    }

    closeModal() {
        this.elements.taskModal.classList.remove('active');
        this.elements.taskForm.reset();
        this.currentTask = null;
        this.isEditing = false;
    }

    saveTask() {
        const taskData = {
            id: this.isEditing ? this.currentTask.id : this.generateId(),
            title: this.elements.taskTitle.value.trim(),
            date: this.elements.taskDate.value,
            priority: this.elements.taskPriority.value,
            description: this.elements.taskDescription.value.trim(),
            category: this.elements.taskCategory.value,
            completed: this.isEditing ? this.currentTask.completed : false,
            createdAt: this.isEditing ? this.currentTask.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (!taskData.title) {
            this.showNotification('Task title is required!', 'error');
            return;
        }

        if (this.isEditing) {
            const index = this.tasks.findIndex(t => t.id === taskData.id);
            if (index !== -1) {
                this.tasks[index] = taskData;
            }
        } else {
            this.tasks.unshift(taskData);
        }

        this.saveToLocalStorage();
        this.renderTasks();
        this.closeModal();
        
        const message = this.isEditing ? 'Task updated successfully!' : 'Task added successfully!';
        this.showNotification(message, 'success');
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.updatedAt = new Date().toISOString();
            this.saveToLocalStorage();
            this.renderTasks();
            
            const message = task.completed ? 'Task completed!' : 'Task marked as pending';
            this.showNotification(message, 'success');
        }
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.openModal(task);
        }
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveToLocalStorage();
            this.renderTasks();
            this.showNotification('Task deleted successfully!', 'success');
        }
    }

    clearCompleted() {
        if (this.tasks.some(task => task.completed)) {
            if (confirm('Clear all completed tasks?')) {
                this.tasks = this.tasks.filter(task => !task.completed);
                this.saveToLocalStorage();
                this.renderTasks();
                this.showNotification('Completed tasks cleared!', 'success');
            }
        } else {
            this.showNotification('No completed tasks to clear', 'info');
        }
    }

    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `todo-tasks-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Tasks exported successfully!', 'success');
    }

    importTasks() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const importedTasks = JSON.parse(event.target.result);
                    if (Array.isArray(importedTasks)) {
                        // Merge with existing tasks, avoid duplicates
                        const existingIds = new Set(this.tasks.map(t => t.id));
                        const newTasks = importedTasks.filter(t => !existingIds.has(t.id));
                        this.tasks.push(...newTasks);
                        this.saveToLocalStorage();
                        this.renderTasks();
                        this.showNotification(`Imported ${newTasks.length} tasks!`, 'success');
                    } else {
                        throw new Error('Invalid file format');
                    }
                } catch (error) {
                    this.showNotification('Error importing tasks. Invalid file format.', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    saveToLocalStorage() {
        localStorage.setItem('todo-tasks', JSON.stringify(this.tasks));
    }

    showNotification(message, type = 'success') {
        const colors = {
            success: '#4cc9f0',
            error: '#ef4444',
            info: '#f8961e'
        };
        
        this.elements.notificationText.textContent = message;
        this.elements.notification.style.backgroundColor = colors[type];
        this.elements.notification.querySelector('i').className = 
            type === 'success' ? 'fas fa-check-circle' :
            type === 'error' ? 'fas fa-exclamation-circle' :
            'fas fa-info-circle';
        
        this.elements.notification.classList.add('show');
        
        setTimeout(() => {
            this.elements.notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
    window.todoApp = app; // Make it accessible from console for debugging
});