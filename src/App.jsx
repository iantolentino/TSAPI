import React, { useState, useEffect } from 'react';
import SearchBar from './components/common/SearchBar';
import FeedList from './components/feeds/FeedList';
import CategoryCard from './components/categories/CategoryCard';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import techSupportApi from './services/api/techSupportApi';
import { MOCK_CATEGORIES } from './services/api/externalApis';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  const handleSearch = async (query, category) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await techSupportApi.searchSolutions(query, category);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = async (categoryId) => {
    setSelectedCategory(categoryId);
    setIsLoading(true);
    
    try {
      const results = await techSupportApi.searchSolutions(categoryId, 'all');
      setSearchResults(results);
    } catch (error) {
      console.error('Category search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = (solutionId, isBookmarked) => {
    if (isBookmarked) {
      setBookmarks(prev => [...prev, solutionId]);
    } else {
      setBookmarks(prev => prev.filter(id => id !== solutionId));
    }
  };

  useEffect(() => {
    // Load initial data or featured solutions
    handleSearch('common tech issues', 'all');
  }, []);

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <section className="hero-section">
          <h1>Tech Support Knowledge Hub</h1>
          <p>Find solutions for networking, printers, Active Directory, and more</p>
          
          <div className="search-section">
            <SearchBar onSearch={handleSearch} />
          </div>
        </section>

        <section className="categories-section">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            {MOCK_CATEGORIES.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategorySelect(category.id)}
                isSelected={selectedCategory === category.id}
              />
            ))}
          </div>
        </section>

        <section className="results-section">
          <div className="section-header">
            <h2>
              {selectedCategory 
                ? `Solutions for ${selectedCategory}`
                : 'Latest Solutions & Fixes'}
            </h2>
            <div className="results-count">
              {searchResults.length} solutions found
            </div>
          </div>

          {isLoading ? (
            <div className="loading">Loading solutions...</div>
          ) : (
            <FeedList 
              solutions={searchResults}
              onBookmark={handleBookmark}
              bookmarks={bookmarks}
            />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;