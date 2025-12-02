import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search for tech issues..." }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, category);
    }
  };

  const quickSearches = [
    'WiFi not connecting',
    'Printer offline',
    'Active Directory password reset',
    'DNS server not responding',
    'Blue Screen of Death'
  ];

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            <option value="networking">Networking</option>
            <option value="printers">Printers</option>
            <option value="active-directory">Active Directory</option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
          </select>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="search-input"
            autoFocus
          />
          
          <button type="submit" className="search-button">
            🔍 Search
          </button>
        </div>
      </form>
      
      <div className="quick-searches">
        <span>Quick searches: </span>
        {quickSearches.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setQuery(item);
              onSearch(item, 'all');
            }}
            className="quick-search-chip"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;