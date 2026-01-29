document.addEventListener('DOMContentLoaded', function() {
    // API Configuration
    const forumLatest = 'https://cdn.freecodecamp.org/curriculum/forum-latest/latest.json';
    const forumTopicUrl = 'https://forum.freecodecamp.org/t/';
    const forumCategoryUrl = 'https://forum.freecodecamp.org/c/';
    const avatarUrl = 'https://cdn.freecodecamp.org/curriculum/forum-latest';
    
    // Category Definitions
    const allCategories = {
        299: { category: 'Career Advice', className: 'career', color: 'var(--career)' },
        409: { category: 'Project Feedback', className: 'feedback', color: 'var(--feedback)' },
        417: { category: 'freeCodeCamp Support', className: 'support', color: 'var(--support)' },
        421: { category: 'JavaScript', className: 'javascript', color: 'var(--javascript)' },
        423: { category: 'HTML - CSS', className: 'html-css', color: 'var(--html-css)' },
        424: { category: 'Python', className: 'python', color: 'var(--python)' },
        432: { category: 'You Can Do This!', className: 'motivation', color: 'var(--motivation)' },
        560: { category: 'Backend Development', className: 'backend', color: 'var(--backend)' }
    };
    
    // Global State
    let forumData = null;
    let filteredTopics = [];
    let currentPage = 1;
    const itemsPerPage = 20;
    let currentSort = 'latest';
    let currentCategoryFilter = 'all';
    let currentSearch = '';
    let sortDirection = 'desc';
    
    // DOM Elements
    const postsContainer = document.getElementById('posts-container');
    const cardsContainer = document.getElementById('cards-container');
    const loadingElement = document.getElementById('loading');
    const errorContainer = document.getElementById('error-container');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const sortSelect = document.getElementById('sort-select');
    const refreshBtn = document.getElementById('refresh-btn');
    const retryBtn = document.getElementById('retry-btn');
    const categoryFilters = document.getElementById('category-filters');
    const filterText = document.getElementById('filter-text');
    const viewButtons = document.querySelectorAll('.view-btn');
    const tableView = document.getElementById('table-view');
    const cardsView = document.getElementById('cards-view');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');
    const onlineCount = document.getElementById('online-count');
    const postsToday = document.getElementById('posts-today');
    const activeTopics = document.getElementById('active-topics');
    const contributorsList = document.getElementById('contributors-list');
    const hotTopics = document.getElementById('hot-topics');
    const buildVersion = document.getElementById('build-version');
    const lastUpdated = document.getElementById('last-updated');
    
    // Initialize
    initializeApp();
    
    function initializeApp() {
        setupEventListeners();
        createCategoryFilters();
        loadForumData();
        updateLastUpdated();
    }
    
    function setupEventListeners() {
        // Search functionality
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        clearSearchBtn.addEventListener('click', clearSearch);
        
        // Sort functionality
        sortSelect.addEventListener('change', handleSortChange);
        
        // Refresh button
        refreshBtn.addEventListener('click', loadForumData);
        
        // Retry button
        retryBtn.addEventListener('click', loadForumData);
        
        // View toggle
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => switchView(btn.dataset.view));
        });
        
        // Pagination
        prevBtn.addEventListener('click', goToPreviousPage);
        nextBtn.addEventListener('click', goToNextPage);
        
        // Table sorting headers
        document.querySelectorAll('th[data-sort]').forEach(th => {
            th.addEventListener('click', () => handleTableSort(th.dataset.sort));
        });
    }
    
    function createCategoryFilters() {
        categoryFilters.innerHTML = '';
        
        // All categories option
        const allOption = document.createElement('div');
        allOption.className = 'category-option';
        allOption.innerHTML = `
            <input type="radio" id="category-all" name="category" value="all" checked>
            <label for="category-all">All Categories</label>
        `;
        allOption.addEventListener('click', () => setCategoryFilter('all'));
        categoryFilters.appendChild(allOption);
        
        // Individual category options
        Object.entries(allCategories).forEach(([id, cat]) => {
            const option = document.createElement('div');
            option.className = 'category-option';
            option.innerHTML = `
                <input type="radio" id="category-${id}" name="category" value="${id}">
                <div class="category-color" style="background: ${cat.color}"></div>
                <label for="category-${id}">${cat.category}</label>
            `;
            option.addEventListener('click', () => setCategoryFilter(id));
            categoryFilters.appendChild(option);
        });
    }
    
    function loadForumData() {
        showLoading();
        hideError();
        
        fetch(forumLatest)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                forumData = data;
                processForumData(data);
                hideLoading();
                updateUI();
            })
            .catch(error => {
                console.error('Error loading forum data:', error);
                hideLoading();
                showError();
            });
    }
    
    function processForumData(data) {
        const topics = data.topic_list.topics;
        const users = data.users;
        
        // Process topics with user data
        filteredTopics = topics.map(topic => {
            const category = allCategories[topic.category_id] || { 
                category: 'General', 
                className: 'general', 
                color: 'var(--general)' 
            };
            
            // Get posters with user info
            const posters = topic.posters.map(poster => {
                const user = users.find(u => u.id === poster.user_id);
                return {
                    ...poster,
                    user: user || null
                };
            });
            
            return {
                ...topic,
                category,
                posters,
                replies: topic.posts_count - 1,
                lastActivity: new Date(topic.bumped_at),
                formattedViews: formatViews(topic.views),
                timeAgo: getTimeAgo(topic.bumped_at)
            };
        });
        
        // Update stats
        updateStats(data);
        updateTopContributors(data.users);
        updateHotTopics(topics);
    }
    
    function updateUI() {
        // Apply filters and sorting
        let displayTopics = [...filteredTopics];
        
        // Apply search filter
        if (currentSearch) {
            const searchTerm = currentSearch.toLowerCase();
            displayTopics = displayTopics.filter(topic => 
                topic.title.toLowerCase().includes(searchTerm) ||
                topic.category.category.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply category filter
        if (currentCategoryFilter !== 'all') {
            displayTopics = displayTopics.filter(topic => 
                topic.category_id.toString() === currentCategoryFilter
            );
        }
        
        // Apply sorting
        displayTopics.sort(getSortFunction(currentSort, sortDirection));
        
        // Update pagination
        updatePagination(displayTopics);
        
        // Get current page topics
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageTopics = displayTopics.slice(startIndex, endIndex);
        
        // Render based on current view
        if (tableView.classList.contains('active')) {
            renderTableView(pageTopics);
        } else {
            renderCardsView(pageTopics);
        }
        
        // Show/hide empty state
        if (pageTopics.length === 0) {
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    function renderTableView(topics) {
        postsContainer.innerHTML = '';
        
        topics.forEach(topic => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="topic-cell">
                    <a class="post-title" href="${forumTopicUrl}${topic.slug}/${topic.id}" target="_blank">
                        ${topic.title}
                    </a>
                    <a href="${forumCategoryUrl}${topic.category.className}/${topic.category_id}" 
                       class="category" 
                       style="background: ${topic.category.color}">
                        ${topic.category.category}
                    </a>
                </td>
                <td class="avatars-cell">
                    <div class="avatar-container">
                        ${renderAvatars(topic.posters)}
                    </div>
                </td>
                <td class="replies-cell ${topic.replies > 10 ? 'high' : ''}">
                    ${topic.replies}
                </td>
                <td class="views-cell ${topic.views > 1000 ? 'high' : ''}">
                    ${topic.formattedViews}
                </td>
                <td class="activity-cell">
                    ${topic.timeAgo}
                </td>
            `;
            postsContainer.appendChild(row);
        });
    }
    
    function renderCardsView(topics) {
        cardsContainer.innerHTML = '';
        
        topics.forEach(topic => {
            const card = document.createElement('div');
            card.className = 'topic-card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-category" style="background: ${topic.category.color}">
                        ${topic.category.category}
                    </div>
                    <span class="card-activity">
                        <i class="far fa-clock"></i> ${topic.timeAgo}
                    </span>
                </div>
                <a class="card-title" href="${forumTopicUrl}${topic.slug}/${topic.id}" target="_blank">
                    ${topic.title}
                </a>
                <div class="card-avatars">
                    ${renderCardAvatars(topic.posters)}
                </div>
                <div class="card-stats">
                    <div class="stat-item">
                        <span class="stat-value">${topic.replies}</span>
                        <span class="stat-label">Replies</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${topic.formattedViews}</span>
                        <span class="stat-label">Views</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${topic.posters.length}</span>
                        <span class="stat-label">Participants</span>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(card);
        });
    }
    
    function renderAvatars(posters) {
        // Limit to 5 avatars for table view
        const limitedPosters = posters.slice(0, 5);
        return limitedPosters.map(poster => {
            if (!poster.user) return '';
            const avatarSrc = getAvatarUrl(poster.user.avatar_template);
            return `<img src="${avatarSrc}" alt="${poster.user.name}" title="${poster.user.name}">`;
        }).join('');
    }
    
    function renderCardAvatars(posters) {
        // Limit to 3 avatars for card view
        const limitedPosters = posters.slice(0, 3);
        let html = limitedPosters.map(poster => {
            if (!poster.user) return '';
            const avatarSrc = getAvatarUrl(poster.user.avatar_template);
            return `<img src="${avatarSrc}" alt="${poster.user.name}">`;
        }).join('');
        
        // Show count of additional participants
        if (posters.length > 3) {
            html += `<span class="more-avatars">+${posters.length - 3}</span>`;
        }
        
        return html;
    }
    
    function getAvatarUrl(avatarTemplate) {
        if (!avatarTemplate) return 'https://cdn.freecodecamp.org/platform/universal/fcc_primary.svg';
        let src = avatarTemplate.replace('{size}', '30');
        if (!src.startsWith('http')) {
            src = `${avatarUrl}${src}`;
        }
        return src;
    }
    
    function updateStats(data) {
        // Simulate online users (in real app, this would come from API)
        onlineCount.textContent = Math.floor(Math.random() * 500) + 1000;
        
        // Count posts from today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTopics = data.topic_list.topics.filter(topic => {
            const topicDate = new Date(topic.created_at);
            return topicDate >= today;
        });
        postsToday.textContent = todayTopics.length;
        
        // Count active topics (replied to in last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const active = data.topic_list.topics.filter(topic => {
            const lastActivity = new Date(topic.bumped_at);
            return lastActivity >= yesterday;
        });
        activeTopics.textContent = active.length;
        
        // Update category counts
        updateCategoryCounts(data.topic_list.topics);
    }
    
    function updateCategoryCounts(topics) {
        const counts = {};
        
        // Initialize counts
        Object.keys(allCategories).forEach(id => {
            counts[id] = 0;
        });
        
        // Count topics per category
        topics.forEach(topic => {
            if (counts[topic.category_id] !== undefined) {
                counts[topic.category_id]++;
            }
        });
        
        // Update UI
        document.getElementById('career-count').textContent = counts[299] || 0;
        document.getElementById('js-count').textContent = counts[421] || 0;
        document.getElementById('python-count').textContent = counts[424] || 0;
        document.getElementById('support-count').textContent = counts[417] || 0;
    }
    
    function updateTopContributors(users) {
        // Sort users by posts count (simulated)
        const topUsers = [...users]
            .sort((a, b) => (b.post_count || 0) - (a.post_count || 0))
            .slice(0, 5);
        
        contributorsList.innerHTML = topUsers.map(user => `
            <a href="https://forum.freecodecamp.org/u/${user.username}" 
               class="contributor-item" target="_blank">
                <img src="${getAvatarUrl(user.avatar_template)}" 
                     alt="${user.name}" 
                     class="contributor-avatar">
                <div class="contributor-info">
                    <div class="contributor-name">${user.name}</div>
                    <div class="contributor-score">${user.post_count || 0} posts</div>
                </div>
            </a>
        `).join('');
    }
    
    function updateHotTopics(topics) {
        // Get topics with most views
        const hot = [...topics]
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);
        
        hotTopics.innerHTML = hot.map(topic => {
            const category = allCategories[topic.category_id] || { 
                category: 'General', 
                className: 'general' 
            };
            
            return `
                <a href="${forumTopicUrl}${topic.slug}/${topic.id}" 
                   class="hot-topic-item" target="_blank">
                    <div>
                        <div class="hot-topic-title">${topic.title}</div>
                        <div class="hot-topic-meta">
                            <span>${formatViews(topic.views)} views</span>
                            <span>${topic.posts_count - 1} replies</span>
                        </div>
                    </div>
                </a>
            `;
        }).join('');
    }
    
    function updatePagination(topics) {
        const totalPages = Math.ceil(topics.length / itemsPerPage);
        
        // Update page info
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        // Update button states
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        
        // Hide pagination if no pages
        document.getElementById('pagination').style.display = 
            totalPages <= 1 ? 'none' : 'flex';
    }
    
    function goToPreviousPage() {
        if (currentPage > 1) {
            currentPage--;
            updateUI();
            scrollToTop();
        }
    }
    
    function goToNextPage() {
        const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateUI();
            scrollToTop();
        }
    }
    
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function handleSearch() {
        currentSearch = searchInput.value.trim();
        currentPage = 1;
        updateUI();
        
        // Show/hide clear button
        clearSearchBtn.style.display = currentSearch ? 'block' : 'none';
    }
    
    function clearSearch() {
        searchInput.value = '';
        currentSearch = '';
        currentPage = 1;
        updateUI();
        clearSearchBtn.style.display = 'none';
    }
    
    function handleSortChange(e) {
        currentSort = e.target.value;
        currentPage = 1;
        updateUI();
    }
    
    function handleTableSort(sortKey) {
        if (currentSort === sortKey) {
            // Toggle direction if same column
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort = sortKey;
            sortDirection = 'desc';
        }
        
        // Update UI
        updateUI();
        
        // Update sort indicators
        updateSortIndicators();
    }
    
    function updateSortIndicators() {
        // Remove all sort indicators
        document.querySelectorAll('th[data-sort] i').forEach(icon => {
            icon.className = 'fas fa-sort';
        });
        
        // Add indicator to current sort column
        const currentTh = document.querySelector(`th[data-sort="${currentSort}"]`);
        if (currentTh) {
            const icon = currentTh.querySelector('i');
            icon.className = sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        }
    }
    
    function setCategoryFilter(categoryId) {
        currentCategoryFilter = categoryId;
        currentPage = 1;
        
        // Update filter text
        if (categoryId === 'all') {
            filterText.textContent = 'All Categories';
        } else {
            const category = allCategories[categoryId];
            filterText.textContent = category.category;
        }
        
        updateUI();
    }
    
    function switchView(view) {
        // Update active button
        viewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Show/hide views
        tableView.classList.toggle('active', view === 'table');
        cardsView.classList.toggle('active', view === 'cards');
        
        // Re-render current page
        updateUI();
    }
    
    function getSortFunction(sortKey, direction) {
        const directionMultiplier = direction === 'asc' ? 1 : -1;
        
        switch(sortKey) {
            case 'title':
                return (a, b) => a.title.localeCompare(b.title) * directionMultiplier;
            case 'category':
                return (a, b) => a.category.category.localeCompare(b.category.category) * directionMultiplier;
            case 'replies':
                return (a, b) => (a.replies - b.replies) * directionMultiplier;
            case 'views':
                return (a, b) => (a.views - b.views) * directionMultiplier;
            case 'activity':
                return (a, b) => (a.lastActivity - b.lastActivity) * directionMultiplier;
            case 'newest':
                return (a, b) => (new Date(a.created_at) - new Date(b.created_at)) * directionMultiplier;
            case 'oldest':
                return (a, b) => (new Date(b.created_at) - new Date(a.created_at)) * directionMultiplier;
            default: // 'latest'
                return (a, b) => (a.lastActivity - b.lastActivity) * directionMultiplier;
        }
    }
    
    function formatViews(views) {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M';
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        }
        return views.toString();
    }
    
    function getTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return past.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    function updateLastUpdated() {
        const now = new Date();
        lastUpdated.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Update build version (simulated)
        buildVersion.textContent = '1.2.0';
    }
    
    function showLoading() {
        loadingElement.style.display = 'flex';
        postsContainer.innerHTML = '';
        cardsContainer.innerHTML = '';
        emptyState.style.display = 'none';
    }
    
    function hideLoading() {
        loadingElement.style.display = 'none';
    }
    
    function showError() {
        errorContainer.style.display = 'flex';
    }
    
    function hideError() {
        errorContainer.style.display = 'none';
    }
    
    // Utility: Debounce function for search
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});