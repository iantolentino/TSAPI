import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import TechSupportApi from './techSupportApi';

describe('TechSupportApi', () => {
  let mockAxios;
  let techSupportApi;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    techSupportApi = new TechSupportApi();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('searchSolutions', () => {
    test('should cache search results', async () => {
      const query = 'printer offline';
      const category = 'printers';
      
      mockAxios.onGet(/stackexchange/).reply(200, {
        items: [
          {
            question_id: 123,
            title: 'Printer offline fix',
            body: 'Test solution',
            score: 10,
            tags: ['printer', 'windows'],
            creation_date: Date.now() / 1000 - 3600,
            link: 'https://stackoverflow.com/q/123'
          }
        ]
      });

      mockAxios.onGet(/reddit/).reply(200, {
        data: {
          children: []
        }
      });

      // First call - should make API requests
      const firstResult = await techSupportApi.searchSolutions(query, category);
      expect(firstResult).toHaveLength(1);

      // Second call - should return cached result
      const secondResult = await techSupportApi.searchSolutions(query, category);
      expect(secondResult).toHaveLength(1);
      expect(secondResult[0].id).toBe('so_123');

      // Verify API was called only once due to cache
      expect(mockAxios.history.get.length).toBe(2); // StackOverflow + Reddit
    });

    test('should handle API failures gracefully', async () => {
      const query = 'test query';
      
      mockAxios.onGet(/stackexchange/).reply(500);
      mockAxios.onGet(/reddit/).reply(500);

      const results = await techSupportApi.searchSolutions(query);
      
      // Should return local solutions as fallback
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('searchStackOverflow', () => {
    test('should transform StackOverflow data correctly', async () => {
      const mockResponse = {
        items: [
          {
            question_id: 456,
            title: 'How to fix DNS issues',
            body: 'Detailed explanation...',
            score: 25,
            tags: ['dns', 'networking', 'windows'],
            creation_date: Date.now() / 1000 - 7200,
            link: 'https://stackoverflow.com/q/456'
          }
        ]
      };

      mockAxios.onGet(/stackexchange/).reply(200, mockResponse);

      const results = await techSupportApi.searchStackOverflow('dns');
      
      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        id: 'so_456',
        title: 'How to fix DNS issues',
        source: 'stackoverflow',
        votes: 25,
        tags: ['dns', 'networking', 'windows']
      });
    });
  });

  describe('getLocalSolutions', () => {
    test('should filter solutions by query and category', () => {
      const query = 'printer';
      const category = 'printers';
      
      const results = techSupportApi.getLocalSolutions(query, category);
      
      expect(Array.isArray(results)).toBe(true);
      results.forEach(solution => {
        expect(
          solution.title.toLowerCase().includes(query) ||
          solution.description.toLowerCase().includes(query) ||
          solution.tags.some(tag => tag.toLowerCase().includes(query))
        ).toBe(true);
        
        expect(
          category === 'all' ||
          solution.category === category ||
          solution.tags.includes(category)
        ).toBe(true);
      });
    });
  });

  describe('getPrinterSolutions', () => {
    test('should handle multiple API responses', async () => {
      mockAxios.onGet(/restful-api/).reply(200, [
        { id: '1', name: 'HP LaserJet Pro', data: { type: 'printer' } }
      ]);
      
      mockAxios.onGet(/openlibrary/).reply(200, {
        docs: [
          { title: 'HP LaserJet Manual', author_name: ['HP'] }
        ]
      });

      const results = await techSupportApi.getPrinterSolutions('HP', 'LaserJet Pro');
      
      expect(results).toHaveLength(2);
      expect(results[0]).toEqual([
        { id: '1', name: 'HP LaserJet Pro', data: { type: 'printer' } }
      ]);
      expect(results[1]).toEqual({
        docs: [
          { title: 'HP LaserJet Manual', author_name: ['HP'] }
        ]
      });
    });
  });
});