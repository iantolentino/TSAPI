import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedItem from './FeedItem';

const mockSolution = {
  id: 'test-123',
  title: 'How to Fix Printer Offline Issue',
  description: 'Step by step guide to fix printer offline problems',
  source: 'stackoverflow',
  timeAgo: '2 hours ago',
  difficulty: 'beginner',
  tags: ['printer', 'windows', 'networking'],
  likes: 15,
  comments: 3,
  steps: [
    'Check printer connection',
    'Restart print spooler service',
    'Update printer drivers'
  ]
};

describe('FeedItem Component', () => {
  const mockOnBookmark = jest.fn();
  const mockOnLike = jest.fn();
  const mockOnShare = jest.fn();

  beforeEach(() => {
    mockOnBookmark.mockClear();
    mockOnLike.mockClear();
    mockOnShare.mockClear();
  });

  test('renders solution information correctly', () => {
    render(
      <FeedItem
        solution={mockSolution}
        onBookmark={mockOnBookmark}
        onLike={mockOnLike}
        onShare={mockOnShare}
      />
    );

    expect(screen.getByText('How to Fix Printer Offline Issue')).toBeInTheDocument();
    expect(screen.getByText('Step by step guide to fix printer offline problems')).toBeInTheDocument();
    expect(screen.getByText('beginner')).toBeInTheDocument();
    expect(screen.getByText('Stack Overflow')).toBeInTheDocument();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    expect(screen.getByText('👍 15')).toBeInTheDocument();
    expect(screen.getByText('💬 3')).toBeInTheDocument();
  });

  test('renders tags correctly', () => {
    render(
      <FeedItem
        solution={mockSolution}
        onBookmark={mockOnBookmark}
        onLike={mockOnLike}
        onShare={mockOnShare}
      />
    );

    mockSolution.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  test('shows quick steps when available', () => {
    render(
      <FeedItem
        solution={mockSolution}
        onBookmark={mockOnBookmark}
        onLike={mockOnLike}
        onShare={mockOnShare}
      />
    );

    expect(screen.getByText('Quick Steps:')).toBeInTheDocument();
    mockSolution.steps.forEach(step => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  test('handles bookmark click correctly', async () => {
    const user = userEvent.setup();
    render(
      <FeedItem
        solution={mockSolution}
        onBookmark={mockOnBookmark}
        onLike={mockOnLike}
        onShare={mockOnShare}
      />
    );

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    await user.click(bookmarkButton);

    expect(mockOnBookmark).toHaveBeenCalledWith('test-123', true);
    expect(bookmarkButton).toHaveTextContent('🔖 Bookmarked');

    await user.click(bookmarkButton);
    expect(mockOnBookmark).toHaveBeenCalledWith('test-123', false);
  });

  test('handles like click correctly', async () => {
    const user = userEvent.setup();
    render(
      <FeedItem
        solution={mockSolution}
        onBookmark={mockOnBookmark}
        onLike={mockOnLike}
        onShare={mockOnShare}
      />
    );

    const likeButton = screen.getByRole('button', { name: /👍/i });
    await user.click(likeButton);

    expect(mockOnLike).toHaveBeenCalledWith('test-123', true);
    expect(screen.getByText('👍 16')).toBeInTheDocument();

    await user.click(likeButton);
    expect(mockOnLike).toHaveBeenCalledWith('test-123', false);
    expect(screen.getByText('👍 15')).toBeInTheDocument();
  });

  test('handles share click correctly', async () => {
    const user = userEvent.setup();
    render(
      <FeedItem
        solution={mockSolution}
        onBookmark={mockOnBookmark}
        onLike={mockOnLike}
        onShare={mockOnShare}
      />
    );

    const shareButton = screen.getByRole('button', { name: /share/i });
    await user.click(shareButton);

    expect(mockOnShare).toHaveBeenCalledWith(mockSolution);
  });

  test('shows correct source name based on source type', () => {
    const solutionsWithDifferentSources = [
      { ...mockSolution, source: 'reddit' },
      { ...mockSolution, source: 'official' },
      { ...mockSolution, source: 'community' },
    ];

    solutionsWithDifferentSources.forEach(solution => {
      render(
        <FeedItem
          solution={solution}
          onBookmark={mockOnBookmark}
          onLike={mockOnLike}
          onShare={mockOnShare}
        />
      );

      let expectedSourceName;
      switch (solution.source) {
        case 'reddit':
          expectedSourceName = 'Reddit Tech Support';
          break;
        case 'official':
          expectedSourceName = 'Official Docs';
          break;
        default:
          expectedSourceName = 'Tech Community';
      }

      expect(screen.getByText(expectedSourceName)).toBeInTheDocument();
    });
  });
});