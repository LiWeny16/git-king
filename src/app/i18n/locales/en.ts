// English translations
const en = {
  // App
  app: {
    title: 'Git King',
    subtitle: 'Your Intelligent Git Copilot',
    description: 'A scenario-driven, intelligent Git workflow assistant',
  },

  // Navigation
  nav: {
    home: 'Home',
    commands: 'Commands',
    workflows: 'Workflows',
    history: 'History',
    settings: 'Settings',
    aiAssistant: 'AI Assistant',
  },

  // Common actions
  actions: {
    copy: 'Copy',
    copied: 'Copied!',
    search: 'Search',
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    execute: 'Execute',
  },

  // Command palette
  commandPalette: {
    placeholder: 'Search commands and workflows...',
    empty: 'No results found',
    hint: 'Type to search, press Enter to execute',
    categories: {
      workflows: 'Workflows',
      commands: 'Commands',
      repos: 'Repositories',
    },
  },

  // Scenarios
  scenarios: {
    setup: {
      title: 'Setup & Configuration',
      configUser: 'Configure Git User',
      configUserDesc: 'Set global username and email for commits',
      cloneRepo: 'Clone Repository',
      cloneRepoDesc: 'Clone a remote repository to local',
      initRepo: 'Initialize Repository',
      initRepoDesc: 'Create a new local Git repository',
    },
    branching: {
      title: 'Branch Management',
      createBranch: 'Create New Branch',
      createBranchDesc: 'Create and switch to a new feature branch',
      switchBranch: 'Switch Branch',
      switchBranchDesc: 'Switch to an existing branch',
      deleteBranch: 'Delete Branch',
      deleteBranchDesc: 'Delete a merged branch',
    },
    sync: {
      title: 'Commit & Sync',
      commit: 'Commit Changes',
      commitDesc: 'Stage and commit your changes',
      push: 'Push to Remote',
      pushDesc: 'Push local commits to remote repository',
      pull: 'Pull Updates',
      pullDesc: 'Fetch and merge remote changes',
    },
    undo: {
      title: 'Undo & Fix',
      amendCommit: 'Amend Last Commit',
      amendCommitDesc: 'Modify the most recent commit message',
      resetSoft: 'Reset (Keep Changes)',
      resetSoftDesc: 'Undo commits but keep file changes',
      resetHard: 'Reset (Discard All)',
      resetHardDesc: 'Discard all local changes completely',
    },
    merge: {
      title: 'Merge & Rebase',
      mergeBranch: 'Merge Branch',
      mergeBranchDesc: 'Merge another branch into current',
      rebase: 'Rebase',
      rebaseDesc: 'Rebase current branch onto another',
      cherryPick: 'Cherry Pick',
      cherryPickDesc: 'Apply specific commits to current branch',
    },
  },

  // Settings
  settings: {
    title: 'Settings',
    general: 'General',
    appearance: 'Appearance',
    aiConfig: 'AI Configuration',
    apiToken: 'API Token',
    apiTokenPlaceholder: 'Enter your OpenAI API token',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    autoMode: 'System',
  },

  // AI Chat
  ai: {
    title: 'AI Assistant',
    welcome: "Hi! I'm your Git assistant. Ask me anything about Git commands, workflows, or troubleshooting.",
    placeholder: 'Ask about Git...',
    thinking: 'Thinking...',
    error: 'Something went wrong. Please try again.',
    noToken: 'Please configure your AI API token in settings.',
  },

  // Errors
  errors: {
    copyFailed: 'Failed to copy to clipboard',
    loadFailed: 'Failed to load data',
    saveFailed: 'Failed to save changes',
    networkError: 'Network error. Please check your connection.',
  },

  // Success messages
  success: {
    copied: 'Copied to clipboard!',
    saved: 'Changes saved successfully',
    deleted: 'Deleted successfully',
  },
};

export default en;
