document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sections = {
        main: document.getElementById('main-section'),
        form: document.getElementById('form-section'),
        list: document.getElementById('bookmark-list-section')
    };
    
    const buttons = {
        addBookmark: document.getElementById('add-bookmark-button'),
        viewCategory: document.getElementById('view-category-button'),
        closeForm: document.getElementById('close-form-button'),
        closeList: document.getElementById('close-list-button'),
        saveBookmark: document.getElementById('add-bookmark-button-form'),
        deleteBookmark: document.getElementById('delete-bookmark-button'),
        clearAll: document.getElementById('clear-all-btn'),
        exportBtn: document.getElementById('export-btn'),
        importBtn: document.getElementById('import-btn')
    };
    
    const inputs = {
        name: document.getElementById('name'),
        url: document.getElementById('url'),
        category: document.getElementById('category'),
        search: document.getElementById('search-input')
    };
    
    const dropdowns = {
        main: document.getElementById('category-dropdown'),
        form: document.getElementById('category')
    };
    
    const displays = {
        categoryName: document.querySelectorAll('.category-name'),
        totalBookmarks: document.getElementById('total-bookmarks'),
        categoryCount: document.getElementById('category-count'),
        bookmarkCount: document.getElementById('bookmark-count'),
        categoryList: document.getElementById('category-list')
    };
    
    const form = document.getElementById('bookmark-form');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // State
    let selectedBookmark = null;
    
    // Initialize
    updateStats();
    setupEventListeners();

    // Event Listeners Setup
    function setupEventListeners() {
        // Navigation
        buttons.addBookmark.addEventListener('click', showAddForm);
        buttons.viewCategory.addEventListener('click', showCategoryList);
        buttons.closeForm.addEventListener('click', () => showSection('main'));
        buttons.closeList.addEventListener('click', () => showSection('main'));
        
        // Form
        form.addEventListener('submit', saveBookmark);
        
        // Bookmark Actions
        buttons.deleteBookmark.addEventListener('click', deleteSelectedBookmark);
        buttons.clearAll.addEventListener('click', clearAllBookmarks);
        buttons.exportBtn.addEventListener('click', exportBookmarks);
        buttons.importBtn.addEventListener('click', triggerImport);
        
        // Dropdowns
        dropdowns.main.addEventListener('change', updateCategoryDisplay);
        dropdowns.form.addEventListener('change', updateCategoryDisplay);
        
        // Search
        inputs.search.addEventListener('input', filterBookmarks);
        
        // Quick actions with confirmation
        buttons.clearAll.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete ALL bookmarks?')) {
                clearAllBookmarks();
            }
        });
    }

    // Data Functions
    function getBookmarks() {
        try {
            const stored = localStorage.getItem('bookmarks');
            const bookmarks = stored ? JSON.parse(stored) : [];
            
            // Validate bookmarks structure
            if (Array.isArray(bookmarks) && 
                bookmarks.every(b => b && b.name && b.category && b.url)) {
                return bookmarks;
            }
            return [];
        } catch (error) {
            console.error('Error reading bookmarks:', error);
            return [];
        }
    }

    function saveBookmarks(bookmarks) {
        try {
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            updateStats();
            showToast('Bookmarks saved successfully!');
        } catch (error) {
            console.error('Error saving bookmarks:', error);
            showToast('Error saving bookmarks', 'error');
        }
    }

    // UI Functions
    function showSection(sectionName) {
        Object.values(sections).forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
        });
        
        sections[sectionName].classList.add('active');
        sections[sectionName].classList.remove('hidden');
        
        if (sectionName === 'main') {
            updateStats();
        }
    }

    function showAddForm() {
        // Set form category to match main dropdown
        dropdowns.form.value = dropdowns.main.value;
        updateCategoryDisplay();
        
        // Clear form
        inputs.name.value = '';
        inputs.url.value = '';
        clearErrors();
        
        showSection('form');
        inputs.name.focus();
    }

    function showCategoryList() {
        const selectedCategory = dropdowns.main.value;
        updateCategoryDisplay();
        
        displays.categoryList.innerHTML = '';
        const bookmarks = getBookmarks().filter(b => b.category === selectedCategory);
        
        if (bookmarks.length === 0) {
            displays.categoryList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bookmark fa-3x"></i>
                    <p>No bookmarks in this category yet.</p>
                    <button class="btn-small" onclick="showAddForm()">
                        <i class="fas fa-plus"></i> Add First Bookmark
                    </button>
                </div>
            `;
        } else {
            bookmarks.forEach((bookmark, index) => {
                const bookmarkElement = createBookmarkElement(bookmark, index);
                displays.categoryList.appendChild(bookmarkElement);
            });
        }
        
        displays.bookmarkCount.textContent = `${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''}`;
        showSection('list');
    }

    function createBookmarkElement(bookmark, index) {
        const div = document.createElement('div');
        div.className = 'bookmark-item';
        div.dataset.id = index;
        
        // Extract domain from URL for display
        const domain = new URL(bookmark.url).hostname.replace('www.', '');
        
        div.innerHTML = `
            <input type="radio" name="bookmark" class="bookmark-checkbox" 
                   id="bookmark-${index}" value="${index}">
            <div class="bookmark-content">
                <div class="bookmark-name">
                    <i class="fas fa-bookmark"></i>
                    ${bookmark.name}
                </div>
                <div class="bookmark-url" title="${bookmark.url}">
                    <i class="fas fa-link"></i> ${domain}
                </div>
            </div>
            <div class="bookmark-actions">
                <button class="action-btn" onclick="visitBookmark('${bookmark.url}')" 
                        title="Visit">
                    <i class="fas fa-external-link-alt"></i>
                </button>
                <button class="action-btn" onclick="editBookmark(${index})" 
                        title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `;
        
        const checkbox = div.querySelector('.bookmark-checkbox');
        checkbox.addEventListener('change', updateDeleteButton);
        
        return div;
    }

    // Bookmark Actions
    function saveBookmark(e) {
        e.preventDefault();
        
        clearErrors();
        
        const name = inputs.name.value.trim();
        const url = inputs.url.value.trim();
        const category = dropdowns.form.value;
        
        // Validation
        let isValid = true;
        
        if (!name) {
            showError('name-error', 'Bookmark name is required');
            isValid = false;
        }
        
        if (!url) {
            showError('url-error', 'URL is required');
            isValid = false;
        } else if (!isValidUrl(url)) {
            showError('url-error', 'Please enter a valid URL (include http:// or https://)');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Save bookmark
        const bookmarks = getBookmarks();
        bookmarks.push({ name, category, url, created: new Date().toISOString() });
        saveBookmarks(bookmarks);
        
        showSection('main');
        showToast('Bookmark added successfully!');
    }

    function deleteSelectedBookmark() {
        const selected = document.querySelector('input[name="bookmark"]:checked');
        if (!selected) return;
        
        const index = parseInt(selected.value);
        const bookmarks = getBookmarks();
        
        if (index >= 0 && index < bookmarks.length) {
            bookmarks.splice(index, 1);
            saveBookmarks(bookmarks);
            showCategoryList(); // Refresh the list
            showToast('Bookmark deleted');
        }
    }

    function clearAllBookmarks() {
        localStorage.removeItem('bookmarks');
        updateStats();
        showToast('All bookmarks cleared');
    }

    // Utility Functions
    function updateStats() {
        const bookmarks = getBookmarks();
        const selectedCategory = dropdowns.main.value;
        const categoryCount = bookmarks.filter(b => b.category === selectedCategory).length;
        
        displays.totalBookmarks.textContent = bookmarks.length;
        displays.categoryCount.textContent = categoryCount;
    }

    function updateCategoryDisplay() {
        const selectedCategory = dropdowns.main.value;
        const categoryText = getCategoryDisplayName(selectedCategory);
        
        displays.categoryName.forEach(el => {
            el.textContent = categoryText;
        });
        
        updateStats();
    }

    function getCategoryDisplayName(category) {
        const names = {
            'news': '📰 News',
            'entertainment': '🎬 Entertainment',
            'work': '💼 Work',
            'education': '📚 Education',
            'social': '👥 Social',
            'miscellaneous': '📦 Miscellaneous'
        };
        return names[category] || category;
    }

    function updateDeleteButton() {
        const hasSelection = document.querySelector('input[name="bookmark"]:checked');
        buttons.deleteBookmark.disabled = !hasSelection;
    }

    function filterBookmarks() {
        const searchTerm = inputs.search.value.toLowerCase();
        const items = displays.categoryList.querySelectorAll('.bookmark-item');
        
        items.forEach(item => {
            const name = item.querySelector('.bookmark-name').textContent.toLowerCase();
            const url = item.querySelector('.bookmark-url').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || url.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
        }
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
    }

    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    function exportBookmarks() {
        const bookmarks = getBookmarks();
        const dataStr = JSON.stringify(bookmarks, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `bookmarks-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showToast('Bookmarks exported successfully!');
    }

    function triggerImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = event => {
                try {
                    const imported = JSON.parse(event.target.result);
                    
                    // Validate imported data
                    if (Array.isArray(imported) && 
                        imported.every(b => b.name && b.category && b.url)) {
                        
                        if (confirm(`Import ${imported.length} bookmarks? This will replace your current bookmarks.`)) {
                            localStorage.setItem('bookmarks', JSON.stringify(imported));
                            updateStats();
                            showToast(`${imported.length} bookmarks imported!`);
                        }
                    } else {
                        showToast('Invalid bookmarks file format', 'error');
                    }
                } catch (error) {
                    showToast('Error importing bookmarks', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    // Global functions for inline event handlers
    window.visitBookmark = function(url) {
        window.open(url, '_blank');
    };

    window.editBookmark = function(index) {
        const bookmarks = getBookmarks();
        const bookmark = bookmarks[index];
        
        if (bookmark) {
            inputs.name.value = bookmark.name;
            inputs.url.value = bookmark.url;
            dropdowns.form.value = bookmark.category;
            
            // Remove the bookmark being edited
            bookmarks.splice(index, 1);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            
            updateCategoryDisplay();
            showSection('form');
            showToast('Editing bookmark...');
        }
    };
});