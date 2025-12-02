import React, { useState } from 'react';
import './FeedItem.css';

const FeedItem = ({ 
  solution, 
  onBookmark,
  onLike,
  onShare 
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(solution.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark(solution.id, !isBookmarked);
  };

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikes(newLiked ? likes + 1 : likes - 1);
    onLike(solution.id, newLiked);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': '#4CAF50',
      'intermediate': '#FF9800',
      'advanced': '#F44336'
    };
    return colors[difficulty] || '#9E9E9E';
  };

  return (
    <div className="feed-item">
      <div className="feed-header">
        <div className="user-info">
          <div className="avatar">
            {solution.source === 'community' ? '👥' : '🔧'}
          </div>
          <div>
            <h4 className="source-name">
              {solution.source === 'stackoverflow' ? 'Stack Overflow' :
               solution.source === 'reddit' ? 'Reddit Tech Support' :
               solution.source === 'official' ? 'Official Docs' :
               'Tech Community'}
            </h4>
            <span className="timestamp">
              {solution.timeAgo || 'Recently'}
            </span>
          </div>
        </div>
        
        <div className="difficulty-badge" 
             style={{backgroundColor: getDifficultyColor(solution.difficulty)}}>
          {solution.difficulty}
        </div>
      </div>

      <div className="feed-content">
        <h3 className="problem-title">{solution.title}</h3>
        <p className="problem-description">{solution.description}</p>
        
        {solution.steps && solution.steps.length > 0 && (
          <div className="quick-steps">
            <strong>Quick Steps:</strong>
            <ol>
              {solution.steps.slice(0, 3).map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="feed-tags">
        {solution.tags && solution.tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>

      <div className="feed-footer">
        <button 
          onClick={handleLike}
          className={`action-button ${isLiked ? 'liked' : ''}`}
        >
          👍 {likes}
        </button>
        
        <button className="action-button">
          💬 {solution.comments || 0}
        </button>
        
        <button 
          onClick={handleBookmark}
          className={`action-button ${isBookmarked ? 'bookmarked' : ''}`}
        >
          {isBookmarked ? '🔖 Bookmarked' : '📑 Bookmark'}
        </button>
        
        <button 
          onClick={() => onShare(solution)}
          className="action-button"
        >
          ↗️ Share
        </button>
      </div>
    </div>
  );
};

export default FeedItem;