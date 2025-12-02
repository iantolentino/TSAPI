export const MOCK_SOLUTIONS = [
  {
    id: 'local_1',
    title: 'How to Fix Printer Offline Status',
    description: 'Complete guide to troubleshoot and fix printer offline issues on Windows 10/11.',
    category: 'printers',
    source: 'official',
    difficulty: 'beginner',
    timeAgo: '1 hour ago',
    tags: ['printer', 'windows', 'offline', 'troubleshooting'],
    likes: 42,
    comments: 8,
    steps: [
      'Check physical connections (USB/Ethernet/WiFi)',
      'Restart the printer and computer',
      'Run Windows Printer Troubleshooter',
      'Update printer drivers',
      'Clear print queue and restart spooler service'
    ],
    estimatedTime: '15 minutes'
  },
  {
    id: 'local_2',
    title: 'Active Directory Password Reset Guide',
    description: 'Step-by-step instructions for resetting AD passwords using PowerShell and GUI.',
    category: 'active-directory',
    source: 'community',
    difficulty: 'intermediate',
    timeAgo: '3 hours ago',
    tags: ['active-directory', 'windows-server', 'powershell', 'security'],
    likes: 89,
    comments: 15,
    steps: [
      'Open Active Directory Users and Computers',
      'Locate the user account',
      'Right-click and select Reset Password',
      'Enter new password and confirm',
      'Check "User must change password at next logon" if needed'
    ],
    estimatedTime: '5 minutes'
  },
  {
    id: 'local_3',
    title: 'Cisco Router Basic Configuration',
    description: 'Essential commands to configure a Cisco router for basic network connectivity.',
    category: 'networking',
    source: 'official',
    difficulty: 'advanced',
    timeAgo: '5 hours ago',
    tags: ['cisco', 'router', 'networking', 'configuration'],
    likes: 156,
    comments: 23,
    steps: [
      'Connect to router via console cable',
      'Enter privileged EXEC mode',
      'Enter global configuration mode',
      'Configure hostname and interfaces',
      'Set up routing and save configuration'
    ],
    estimatedTime: '30 minutes'
  }
];