// Free APIs for tech support knowledge base
export const FREE_APIS = {
  // Tech Documentation APIs
  STACKOVERFLOW: 'https://api.stackexchange.com/2.3/search/advanced',
  GITHUB_GIST: 'https://api.github.com/gists',
  REDDIT: 'https://www.reddit.com/r/techsupport.json',
  TECH_TIPS: 'https://api.publicapis.org/entries?category=technology',
  
  // Hardware/Software APIs
  DEVICE_SPECS: 'https://api.restful-api.dev/objects',
  PRINTER_DB: 'https://openlibrary.org/search.json',
  NETWORK_TOOLS: 'https://api.ipify.org?format=json',
  
  // Community Knowledge
  DEV_TO: 'https://dev.to/api/articles',
  HACKER_NEWS: 'https://hacker-news.firebaseio.com/v0/',
  
  // Local fallback
  LOCAL_KB: '/api/knowledge-base'
};

export const MOCK_CATEGORIES = [
  {
    id: 'networking',
    name: 'Networking',
    icon: '🌐',
    subcategories: ['Routers', 'Switches', 'Firewalls', 'Wi-Fi', 'VPN']
  },
  {
    id: 'printers',
    name: 'Printers',
    icon: '🖨️',
    subcategories: ['Setup', 'Driver Issues', 'Network Printing', 'Paper Jams']
  },
  {
    id: 'active-directory',
    name: 'Active Directory',
    icon: '📁',
    subcategories: ['User Management', 'Group Policy', 'Domain Services', 'Authentication']
  },
  {
    id: 'windows',
    name: 'Windows OS',
    icon: '🪟',
    subcategories: ['Installation', 'Updates', 'BSOD', 'Performance']
  },
  {
    id: 'mac',
    name: 'macOS',
    icon: '🍎',
    subcategories: ['Setup', 'Recovery', 'Permissions', 'Network']
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: '🐧',
    subcategories: ['Commands', 'Services', 'Permissions', 'Networking']
  }
];