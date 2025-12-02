import axios from 'axios';

// Fallback mock data
import { MOCK_SOLUTIONS } from '../../assets/data/mockData';

class TechSupportApi {
  constructor() {
    this.cache = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  async searchSolutions(query, category = 'all') {
    const cacheKey = `search_${query}_${category}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    }

    try {
      // Try Stack Overflow API
      const stackOverflowResults = await this.searchStackOverflow(query);
      
      // Try Reddit Tech Support
      const redditResults = await this.searchReddit(query);
      
      // Combine results
      const combinedResults = [
        ...stackOverflowResults,
        ...redditResults,
        ...this.getLocalSolutions(query, category)
      ];

      // Cache results
      this.cache.set(cacheKey, {
        timestamp: Date.now(),
        data: combinedResults
      });

      return combinedResults;
    } catch (error) {
      console.error('API Error:', error);
      return this.getLocalSolutions(query, category);
    }
  }

  async searchStackOverflow(query) {
    try {
      const response = await axios.get(
        `https://api.stackexchange.com/2.3/search/advanced`,
        {
          params: {
            order: 'desc',
            sort: 'relevance',
            q: query,
            site: 'stackoverflow',
            tagged: 'tech-support',
            pagesize: 10
          }
        }
      );

      return response.data.items.map(item => ({
        id: `so_${item.question_id}`,
        title: item.title,
        description: item.body.substring(0, 200) + '...',
        source: 'stackoverflow',
        url: item.link,
        votes: item.score,
        tags: item.tags,
        timeAgo: this.formatTime(item.creation_date),
        difficulty: this.calculateDifficulty(item)
      }));
    } catch (error) {
      return [];
    }
  }

  async searchReddit(query) {
    try {
      const response = await axios.get(
        `https://www.reddit.com/r/techsupport/search.json`,
        {
          params: {
            q: query,
            restrict_sr: 1,
            sort: 'relevance',
            limit: 10
          }
        }
      );

      return response.data.data.children.map(post => ({
        id: `reddit_${post.data.id}`,
        title: post.data.title,
        description: post.data.selftext.substring(0, 200) + '...',
        source: 'reddit',
        url: `https://reddit.com${post.data.permalink}`,
        votes: post.data.score,
        comments: post.data.num_comments,
        timeAgo: this.formatRedditTime(post.data.created_utc),
        tags: ['community', 'discussion']
      }));
    } catch (error) {
      return [];
    }
  }

  getLocalSolutions(query, category) {
    // Filter mock data based on query and category
    return MOCK_SOLUTIONS.filter(solution => {
      const matchesQuery = solution.title.toLowerCase().includes(query.toLowerCase()) ||
                          solution.description.toLowerCase().includes(query.toLowerCase()) ||
                          solution.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = category === 'all' || 
                             solution.category === category ||
                             solution.tags.includes(category);
      
      return matchesQuery && matchesCategory;
    });
  }

  formatTime(timestamp) {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  formatRedditTime(utcTimestamp) {
    return this.formatTime(utcTimestamp);
  }

  calculateDifficulty(item) {
    if (item.score > 100) return 'beginner';
    if (item.score > 10) return 'intermediate';
    return 'advanced';
  }

  // Device-specific APIs
  async getPrinterSolutions(manufacturer, model) {
    // Use multiple free APIs
    const apis = [
      `https://api.restful-api.dev/objects?name=${manufacturer}+${model}`,
      `https://openlibrary.org/search.json?q=${manufacturer}+${model}+printer`
    ];

    const results = await Promise.allSettled(
      apis.map(url => axios.get(url))
    );

    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value.data);
  }

  async getNetworkConfigTemplates(deviceType) {
    // Return common configuration templates
    const templates = {
      'cisco-router': this.getCiscoConfig(),
      'tplink-router': this.getTPLinkConfig(),
      'ubiquiti': this.getUbiquitiConfig(),
      'generic': this.getGenericRouterConfig()
    };

    return templates[deviceType] || templates.generic;
  }

  getCiscoConfig() {
    return {
      title: 'Basic Cisco Router Configuration',
      steps: [
        'enable',
        'configure terminal',
        'hostname ROUTER_NAME',
        'interface gigabitethernet0/0',
        'ip address 192.168.1.1 255.255.255.0',
        'no shutdown',
        'exit',
        'ip route 0.0.0.0 0.0.0.0 NEXT_HOP_IP',
        'end',
        'copy running-config startup-config'
      ]
    };
  }
}

export default new TechSupportApi();