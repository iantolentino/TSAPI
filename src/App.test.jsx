import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import TechSupportApi from './services/api/techSupportApi';

jest.mock('./services/api/techSupportApi');

describe('App Integration Tests', () => {
  beforeEach(() => {
    TechSupportApi.searchSolutions.mockResolvedValue([
      {
        id: 'test-1',
        title: 'Test Solution 1',
        description: 'Test description 1',
        source: 'stackoverflow',
        difficulty: 'beginner',
        tags: ['test', 'debug'],
        likes: 10,
        comments: 2
      },
      {
        id: 'test-2',
        title: 'Test Solution 2',
        description: 'Test description 2',
        source: 'reddit',
        difficulty: 'intermediate',
        tags: ['networking', 'router'],
        likes: 25,
        comments: 5
      }
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render all main components', async () => {
    render(<App />);

    expect(screen.getByText(/Tech Support Knowledge Hub/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search for tech issues/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/Browse by Category/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Networking/i)).toBeInTheDocument();
    expect(screen.getByText(/Printers/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Directory/i)).toBeInTheDocument();
  });

  test('should perform search and display results', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/search for tech issues/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(searchInput, 'printer issues');
    await user.click(searchButton);

    expect(TechSupportApi.searchSolutions).toHaveBeenCalledWith('printer issues', 'all');

    await waitFor(() => {
      expect(screen.getByText('Test Solution 1')).toBeInTheDocument();
      expect(screen.getByText('Test Solution 2')).toBeInTheDocument();
    });

    const feedItems = screen.getAllByRole('article');
    expect(feedItems).toHaveLength(2);
  });

  test('should filter by category', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Printers')).toBeInTheDocument();
    });

    const printerCategory = screen.getByText('Printers').closest('button');
    await user.click(printerCategory);

    expect(TechSupportApi.searchSolutions).toHaveBeenCalledWith('printers', 'all');

    await waitFor(() => {
      expect(screen.getByText(/Solutions for printers/i)).toBeInTheDocument();
    });
  });

  test('should handle bookmark functionality', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Solution 1')).toBeInTheDocument();
    });

    const bookmarkButtons = screen.getAllByRole('button', { name: /bookmark/i });
    await user.click(bookmarkButtons[0]);

    expect(screen.getByText('🔖 Bookmarked')).toBeInTheDocument();
  });

  test('should update results count', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/2 solutions found/i)).toBeInTheDocument();
    });
  });

  test('should handle loading state', async () => {
    TechSupportApi.searchSolutions.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<App />);

    expect(screen.getByText(/Loading solutions/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading solutions/i)).not.toBeInTheDocument();
    });
  });
});