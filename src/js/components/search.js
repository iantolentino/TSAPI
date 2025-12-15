import { searchSolutions } from '../data/solutions.js';
import { Feed } from './feed.js';
import { UI } from './ui.js';
import { debounce } from '../data/utils.js';

export class SearchComponent {
    constructor(onSearch) {
        this.onSearch = onSearch;
        this.searchInput = null;
        this.searchForm = null;
        this.quickSearchChips = null;
        this.currentCategory = 'all';
    }
    
    initialize() {
        this.searchInput = document.getElementById('searchInput');
        this.searchForm = document.getElementById('searchForm');
        this.quickSearchChips = document.querySelectorAll('.quick-search-chip');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Search form submission
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch();
        });
        
        // Quick search chips
        this.quickSearchChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const searchQuery = chip.getAttribute('data-search');
                this.searchInput.value = searchQuery;
                this.performSearch(searchQuery);
            });
        });
        
        // Real-time search with debounce
        const debouncedSearch = debounce(() => {
            const query = this.searchInput.value.trim();
            if (query.length >= 3 || query.length === 0) {
                this.performSearch(query);
            }
        }, 500);
        
        this.searchInput.addEventListener('input', debouncedSearch);
    }
    
    performSearch(query = null) {
        const searchQuery = query || this.searchInput.value.trim();
        this.onSearch(searchQuery, this.currentCategory);
    }
    
    setCategory(category) {
        this.currentCategory = category;
        if (this.searchInput.value.trim()) {
            this.performSearch();
        }
    }
    
    clearSearch() {
        this.searchInput.value = '';
        this.performSearch('');
    }
}