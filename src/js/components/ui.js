export class UI {
    static showLoading(container) {
        container.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        `;
    }
    
    static hideLoading(container, content = '') {
        container.innerHTML = content;
    }
    
    static showError(container, message) {
        container.innerHTML = `
            <div class="feed-item" style="text-align: center; padding: 3rem;">
                <h3>Error</h3>
                <p>${message}</p>
                <button class="search-button" onclick="location.reload()">Try Again</button>
            </div>
        `;
    }
    
    static updateResultsCount(container, count, query = '') {
        let text;
        if (query) {
            text = `${count} result${count !== 1 ? 's' : ''} for "${query}"`;
        } else {
            text = `${count} solution${count !== 1 ? 's' : ''} found`;
        }
        container.textContent = text;
    }
}