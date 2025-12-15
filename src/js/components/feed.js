import { BookmarkManager } from '../storage/bookmarks.js';
import { LikeManager } from '../storage/likes.js';
import { getSourceIcon } from '../data/utils.js';
import { UI } from './ui.js';

export class FeedComponent {
    constructor() {
        this.bookmarkManager = new BookmarkManager();
        this.likeManager = new LikeManager();
    }
    
    render(solutions, container, titleElement, countElement) {
        if (!solutions || solutions.length === 0) {
            this.renderNoResults(container);
            UI.updateResultsCount(countElement, 0);
            return;
        }
        
        UI.updateResultsCount(countElement, solutions.length);
        
        const feedItems = solutions.map(solution => this.createFeedItem(solution)).join('');
        container.innerHTML = `
            <div class="feed-list">
                ${feedItems}
            </div>
        `;
        
        this.attachEventListeners(container);
    }
    
    createFeedItem(solution) {
        const isBookmarked = this.bookmarkManager.isBookmarked(solution.id);
        const isLiked = this.likeManager.isLiked(solution.id);
        const likeCount = isLiked ? solution.likes + 1 : solution.likes;
        
        return `
            <div class="feed-item" data-id="${solution.id}">
                <div class="feed-header">
                    <div class="user-info">
                        <div class="avatar">${getSourceIcon(solution.source)}</div>
                        <div>
                            <h4 class="source-name">${solution.sourceName}</h4>
                            <span class="timestamp">${solution.timeAgo}</span>
                        </div>
                    </div>
                    <div class="difficulty-badge difficulty-${solution.difficulty}">
                        ${solution.difficulty}
                    </div>
                </div>
                
                <h3 class="problem-title">${solution.title}</h3>
                <p class="problem-description">${solution.description}</p>
                
                ${solution.steps ? `
                <div class="quick-steps">
                    <strong>Quick Steps:</strong>
                    <ol>
                        ${solution.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                ` : ''}
                
                <div class="feed-tags">
                    ${solution.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                
                <div class="feed-footer">
                    <button class="action-button ${isLiked ? 'liked' : ''}" data-action="like" data-id="${solution.id}">
                        <i class="fas fa-thumbs-up"></i> ${likeCount}
                    </button>
                    <button class="action-button" data-action="comment" data-id="${solution.id}">
                        <i class="fas fa-comment"></i> ${solution.comments}
                    </button>
                    <button class="action-button ${isBookmarked ? 'bookmarked' : ''}" data-action="bookmark" data-id="${solution.id}">
                        <i class="fas ${isBookmarked ? 'fa-bookmark' : 'fa-bookmark'}"></i> ${isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                    <button class="action-button" data-action="share" data-id="${solution.id}">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </div>
        `;
    }
    
    attachEventListeners(container) {
        container.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                const solutionId = e.currentTarget.getAttribute('data-id');
                this.handleAction(action, solutionId, e.currentTarget);
            });
        });
    }
    
    handleAction(action, solutionId, button) {
        switch(action) {
            case 'like':
                this.toggleLike(solutionId, button);
                break;
            case 'bookmark':
                this.toggleBookmark(solutionId, button);
                break;
            case 'share':
                this.shareSolution(solutionId);
                break;
            case 'comment':
                this.showComments(solutionId);
                break;
        }
    }
    
    toggleLike(solutionId, button) {
        const wasLiked = this.likeManager.toggleLike(solutionId);
        const likeCountElement = button.querySelector('i').nextSibling;
        const currentCount = parseInt(likeCountElement.textContent.trim());
        
        if (wasLiked) {
            button.classList.add('liked');
            likeCountElement.textContent = ` ${currentCount + 1}`;
        } else {
            button.classList.remove('liked');
            likeCountElement.textContent = ` ${currentCount - 1}`;
        }
    }
    
    toggleBookmark(solutionId, button) {
        const isNowBookmarked = this.bookmarkManager.toggleBookmark(solutionId);
        
        if (isNowBookmarked) {
            button.classList.add('bookmarked');
            button.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
        } else {
            button.classList.remove('bookmarked');
            button.innerHTML = '<i class="fas fa-bookmark"></i> Bookmark';
        }
    }
    
    shareSolution(solutionId) {
        // Implementation would depend on your specific sharing requirements
        alert(`Share solution ${solutionId}`);
    }
    
    showComments(solutionId) {
        // Implementation would depend on your comments system
        alert(`Comments for solution ${solutionId}`);
    }
    
    renderNoResults(container) {
        container.innerHTML = `
            <div class="feed-item" style="text-align: center; padding: 3rem;">
                <h3>No solutions found</h3>
                <p>Try a different search term or browse by category</p>
            </div>
        `;
    }
}