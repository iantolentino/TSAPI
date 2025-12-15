import { SearchComponent } from './components/search.js';
import { CategoriesComponent } from './components/categories.js';
import { FeedComponent } from './components/feed.js';
import { UI } from './components/ui.js';
import { getSolutions, filterSolutionsByCategory, searchSolutions } from './data/solutions.js';
import { categories } from './data/categories.js';

class TechSupportApp {
    constructor() {
        this.currentView = 'home';
        this.currentCategory = 'all';
        this.searchQuery = '';
        
        this.searchComponent = new SearchComponent(this.handleSearch.bind(this));
        this.categoriesComponent = new CategoriesComponent(this.handleCategorySelect.bind(this));
        this.feedComponent = new FeedComponent();
        
        this.initializeApp();
    }
    
    initializeApp() {
        this.setupDOMReferences();
        this.setupEventListeners();
        this.loadHomeView();
        this.searchComponent.initialize();
        
        // Set current year in footer
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }
    
    setupDOMReferences() {
        this.mainContent = document.getElementById('mainContent');
        this.homeLink = document.getElementById('homeLink');
        this.bookmarksLink = document.getElementById('bookmarksLink');
        this.historyLink = document.getElementById('historyLink');
        this.settingsLink = document.getElementById('settingsLink');
    }
    
    setupEventListeners() {
        this.homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadHomeView();
        });
        
        this.bookmarksLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadBookmarksView();
        });
        
        // Add other navigation event listeners as needed
    }
    
    loadHomeView() {
        this.currentView = 'home';
        this.renderHomeView();
    }
    
    renderHomeView() {
        const solutions = getSolutions();
        
        this.mainContent.innerHTML = `
            <section class="hero">
                <h2>Find Tech Solutions Instantly</h2>
                <p>Search for fixes to common IT issues including networking, printers, Active Directory, and more.</p>
            </section>
            
            <section class="search-section">
                <div class="search-container">
                    <form id="searchForm" class="search-form">
                        <input 
                            type="text" 
                            id="searchInput" 
                            class="search-input" 
                            placeholder="Search for tech issues (e.g., 'printer offline', 'WiFi not connecting')" 
                            autofocus
                            value="${this.searchQuery}"
                        >
                        <button type="submit" class="search-button">
                            <i class="fas fa-search"></i> Search
                        </button>
                    </form>
                    <div class="quick-searches">
                        <span>Quick searches: </span>
                        <button class="quick-search-chip" data-search="WiFi not connecting">WiFi not connecting</button>
                        <button class="quick-search-chip" data-search="Printer offline">Printer offline</button>
                        <button class="quick-search-chip" data-search="Active Directory password reset">AD password reset</button>
                        <button class="quick-search-chip" data-search="DNS server not responding">DNS issues</button>
                        <button class="quick-search-chip" data-search="Blue Screen of Death">Blue Screen</button>
                    </div>
                </div>
            </section>
            
            <section class="categories-section">
                <h2 class="section-title">Browse by Category</h2>
                <div class="categories-grid" id="categoriesGrid"></div>
            </section>
            
            <section class="results-section">
                <div class="results-header">
                    <h2 class="section-title" id="resultsTitle">Latest Solutions</h2>
                    <div class="results-count" id="resultsCount">${solutions.length} solutions found</div>
                </div>
                
                <div id="feedContainer"></div>
            </section>
        `;
        
        // Initialize components with new DOM elements
        this.categoriesComponent.render(document.getElementById('categoriesGrid'));
        this.searchComponent.initialize();
        this.renderFeed(solutions);
    }
    
    renderFeed(solutions) {
        const feedContainer = document.getElementById('feedContainer');
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsCount = document.getElementById('resultsCount');
        
        this.feedComponent.render(
            solutions,
            feedContainer,
            resultsTitle,
            resultsCount
        );
    }
    
    handleSearch(query, category) {
        this.searchQuery = query;
        
        let solutions;
        let title = 'Latest Solutions';
        
        if (query.trim()) {
            solutions = searchSolutions(query, category);
            title = `Search Results for "${query}"`;
        } else {
            solutions = filterSolutionsByCategory(category);
            const cat = categories.find(c => c.id === category);
            title = category === 'all' ? 'Latest Solutions' : `${cat.name} Solutions`;
        }
        
        document.getElementById('resultsTitle').textContent = title;
        this.renderFeed(solutions);
    }
    
    handleCategorySelect(categoryId) {
        this.currentCategory = categoryId;
        this.searchComponent.setCategory(categoryId);
        this.handleSearch(this.searchQuery, categoryId);
    }
    
    loadBookmarksView() {
        this.currentView = 'bookmarks';
        // Implementation for bookmarks view
        this.mainContent.innerHTML = `
            <section class="hero">
                <h2>Your Bookmarked Solutions</h2>
                <p>Access your saved solutions here</p>
            </section>
            <div id="bookmarksContainer"></div>
        `;
        
        // Load bookmarked solutions
        const bookmarkedSolutions = this.feedComponent.bookmarkManager.getBookmarkedSolutions(getSolutions());
        this.feedComponent.render(
            bookmarkedSolutions,
            document.getElementById('bookmarksContainer'),
            null,
            null
        );
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TechSupportApp();
    window.app = app; // Make app available globally for debugging
});