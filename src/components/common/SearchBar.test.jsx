import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText(/search for tech issues/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // category select
  });

  test('calls onSearch with query and category on form submit', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search for tech issues/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    const categorySelect = screen.getByRole('combobox');

    await user.type(searchInput, 'printer offline');
    await user.selectOptions(categorySelect, 'printers');
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('printer offline', 'printers');
  });

  test('calls onSearch when pressing Enter', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search for tech issues/i);
    
    await user.type(searchInput, 'wifi not connecting{enter}');
    
    expect(mockOnSearch).toHaveBeenCalledWith('wifi not connecting', 'all');
  });

  test('does not call onSearch with empty query', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('renders quick search chips and works correctly', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const quickSearchChips = screen.getAllByRole('button', { name: /WiFi not connecting|Printer offline|Active Directory password reset|DNS server not responding|Blue Screen of Death/i });
    expect(quickSearchChips).toHaveLength(5);
    
    await user.click(screen.getByText('WiFi not connecting'));
    
    expect(mockOnSearch).toHaveBeenCalledWith('WiFi not connecting', 'all');
    
    const searchInput = screen.getByPlaceholderText(/search for tech issues/i);
    expect(searchInput.value).toBe('WiFi not connecting');
  });

  test('auto-focuses search input on render', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search for tech issues/i);
    expect(searchInput).toHaveFocus();
  });

  test('shows correct placeholder text', () => {
    const customPlaceholder = 'Search for networking issues...';
    render(<SearchBar onSearch={mockOnSearch} placeholder={customPlaceholder} />);
    
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });
});