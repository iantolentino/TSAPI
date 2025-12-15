import { STORAGE_KEYS } from '../config/constants.js';

export class BookmarkManager {
    constructor() {
        this.key = STORAGE_KEYS.BOOKMARKS;
        this.bookmarks = this.loadBookmarks();
    }
    
    loadBookmarks() {
        try {
            const stored = localStorage.getItem(this.key);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading bookmarks:', error);
            return [];
        }
    }
    
    saveBookmarks() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.bookmarks));
        } catch (error) {
            console.error('Error saving bookmarks:', error);
        }
    }
    
    toggleBookmark(solutionId) {
        const index = this.bookmarks.indexOf(solutionId);
        if (index === -1) {
            this.bookmarks.push(solutionId);
        } else {
            this.bookmarks.splice(index, 1);
        }
        this.saveBookmarks();
        return index === -1; // Returns true if bookmarked, false if removed
    }
    
    isBookmarked(solutionId) {
        return this.bookmarks.includes(solutionId);
    }
    
    getBookmarkedSolutions(allSolutions) {
        return allSolutions.filter(solution => this.isBookmarked(solution.id));
    }
    
    clearBookmarks() {
        this.bookmarks = [];
        this.saveBookmarks();
    }
}