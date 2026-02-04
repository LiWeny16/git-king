// Atomic Git command definitions
// Each command represents a single Git operation with metadata

export interface GitCommand {
  id: string;
  command: string;
  description: string;
  category: CommandCategory;
  tags: string[];
  examples?: string[];
  notes?: string;
  dangerous?: boolean;
}

export type CommandCategory =
  | 'init'
  | 'branch'
  | 'commit'
  | 'remote'
  | 'diff'
  | 'undo'
  | 'stash'
  | 'tag'
  | 'advanced'
  | 'config';

// Comprehensive Git command library
export const GIT_COMMANDS: GitCommand[] = [
  // Configuration Commands
  {
    id: 'config-user-name',
    command: 'git config --global user.name "Your Name"',
    description: 'Set global username for commits',
    category: 'config',
    tags: ['config', 'setup', 'user', 'identity'],
    examples: ['git config --global user.name "John Doe"'],
  },
  {
    id: 'config-user-email',
    command: 'git config --global user.email "you@example.com"',
    description: 'Set global email for commits',
    category: 'config',
    tags: ['config', 'setup', 'email', 'identity'],
    examples: ['git config --global user.email "john@example.com"'],
  },
  {
    id: 'config-color-ui',
    command: 'git config --global color.ui true',
    description: 'Enable colored output in terminal',
    category: 'config',
    tags: ['config', 'ui', 'color'],
  },
  {
    id: 'config-list',
    command: 'git config --list',
    description: 'List all Git configuration settings',
    category: 'config',
    tags: ['config', 'list', 'view'],
  },

  // Initialization Commands
  {
    id: 'init',
    command: 'git init',
    description: 'Initialize a new Git repository',
    category: 'init',
    tags: ['init', 'new', 'repository', 'start'],
  },
  {
    id: 'clone',
    command: 'git clone <url>',
    description: 'Clone a remote repository to local',
    category: 'init',
    tags: ['clone', 'download', 'remote', 'copy'],
    examples: [
      'git clone https://github.com/user/repo.git',
      'git clone git@github.com:user/repo.git',
    ],
  },
  {
    id: 'remote-add',
    command: 'git remote add origin <url>',
    description: 'Link local repository to remote',
    category: 'remote',
    tags: ['remote', 'origin', 'link', 'connect'],
    examples: ['git remote add origin https://github.com/user/repo.git'],
  },
  {
    id: 'remote-list',
    command: 'git remote -v',
    description: 'List all remote repositories',
    category: 'remote',
    tags: ['remote', 'list', 'view'],
  },

  // Status & Info Commands
  {
    id: 'status',
    command: 'git status',
    description: 'Show working tree status',
    category: 'commit',
    tags: ['status', 'check', 'info', 'changes'],
  },
  {
    id: 'log',
    command: 'git log --oneline',
    description: 'Show commit history in compact format',
    category: 'commit',
    tags: ['log', 'history', 'commits', 'view'],
  },
  {
    id: 'log-graph',
    command: 'git log --graph --oneline --all',
    description: 'Show commit history as a graph',
    category: 'commit',
    tags: ['log', 'graph', 'visual', 'history'],
  },

  // Branch Commands
  {
    id: 'branch-list',
    command: 'git branch',
    description: 'List all local branches',
    category: 'branch',
    tags: ['branch', 'list', 'view'],
  },
  {
    id: 'branch-list-all',
    command: 'git branch -a',
    description: 'List all branches (local and remote)',
    category: 'branch',
    tags: ['branch', 'list', 'remote', 'all'],
  },
  {
    id: 'branch-create',
    command: 'git checkout -b <branch-name>',
    description: 'Create and switch to new branch',
    category: 'branch',
    tags: ['branch', 'create', 'new', 'checkout'],
    examples: ['git checkout -b feature/login', 'git checkout -b fix/bug-123'],
  },
  {
    id: 'branch-switch',
    command: 'git switch <branch-name>',
    description: 'Switch to existing branch',
    category: 'branch',
    tags: ['branch', 'switch', 'checkout'],
    examples: ['git switch main', 'git switch develop'],
  },
  {
    id: 'branch-delete',
    command: 'git branch -d <branch-name>',
    description: 'Delete merged local branch',
    category: 'branch',
    tags: ['branch', 'delete', 'remove'],
    examples: ['git branch -d feature/completed'],
  },
  {
    id: 'branch-delete-force',
    command: 'git branch -D <branch-name>',
    description: 'Force delete local branch',
    category: 'branch',
    tags: ['branch', 'delete', 'force', 'remove'],
    dangerous: true,
    notes: 'Use with caution - deletes unmerged branches',
  },
  {
    id: 'branch-rename',
    command: 'git branch -m <old-name> <new-name>',
    description: 'Rename a branch',
    category: 'branch',
    tags: ['branch', 'rename', 'move'],
    examples: ['git branch -m old-feature new-feature'],
  },

  // Commit Commands
  {
    id: 'add-all',
    command: 'git add .',
    description: 'Stage all changes in current directory',
    category: 'commit',
    tags: ['add', 'stage', 'all'],
  },
  {
    id: 'add-file',
    command: 'git add <file>',
    description: 'Stage specific file',
    category: 'commit',
    tags: ['add', 'stage', 'file'],
    examples: ['git add README.md', 'git add src/App.tsx'],
  },
  {
    id: 'commit',
    command: 'git commit -m "message"',
    description: 'Commit staged changes with message',
    category: 'commit',
    tags: ['commit', 'save', 'message'],
    examples: [
      'git commit -m "feat: add login feature"',
      'git commit -m "fix: resolve navigation bug"',
    ],
  },
  {
    id: 'commit-amend',
    command: 'git commit --amend -m "message"',
    description: 'Modify the last commit message',
    category: 'commit',
    tags: ['commit', 'amend', 'modify', 'fix'],
    examples: ['git commit --amend -m "fix: correct commit message"'],
  },
  {
    id: 'commit-all',
    command: 'git commit -am "message"',
    description: 'Stage and commit all tracked files',
    category: 'commit',
    tags: ['commit', 'add', 'all', 'quick'],
  },

  // Remote Operations
  {
    id: 'fetch',
    command: 'git fetch',
    description: 'Download remote repository data',
    category: 'remote',
    tags: ['fetch', 'download', 'sync', 'remote'],
  },
  {
    id: 'fetch-prune',
    command: 'git fetch --prune',
    description: 'Fetch and remove deleted remote branches',
    category: 'remote',
    tags: ['fetch', 'prune', 'clean', 'remote'],
  },
  {
    id: 'pull',
    command: 'git pull',
    description: 'Fetch and merge remote changes',
    category: 'remote',
    tags: ['pull', 'fetch', 'merge', 'sync'],
  },
  {
    id: 'pull-rebase',
    command: 'git pull --rebase',
    description: 'Fetch and rebase local commits',
    category: 'remote',
    tags: ['pull', 'rebase', 'sync'],
  },
  {
    id: 'push',
    command: 'git push',
    description: 'Push commits to remote repository',
    category: 'remote',
    tags: ['push', 'upload', 'sync', 'remote'],
  },
  {
    id: 'push-upstream',
    command: 'git push -u origin <branch-name>',
    description: 'Push and set upstream tracking',
    category: 'remote',
    tags: ['push', 'upstream', 'track', 'remote'],
    examples: ['git push -u origin feature/new-feature'],
  },
  {
    id: 'push-force',
    command: 'git push --force',
    description: 'Force push to remote (overwrite)',
    category: 'remote',
    tags: ['push', 'force', 'overwrite'],
    dangerous: true,
    notes: 'Use with extreme caution - can overwrite remote history',
  },
  {
    id: 'push-delete-branch',
    command: 'git push origin --delete <branch-name>',
    description: 'Delete remote branch',
    category: 'remote',
    tags: ['push', 'delete', 'remote', 'branch'],
    examples: ['git push origin --delete feature/old-feature'],
  },

  // Diff Commands
  {
    id: 'diff',
    command: 'git diff',
    description: 'Show unstaged changes',
    category: 'diff',
    tags: ['diff', 'changes', 'compare'],
  },
  {
    id: 'diff-staged',
    command: 'git diff --staged',
    description: 'Show staged changes',
    category: 'diff',
    tags: ['diff', 'staged', 'changes'],
  },
  {
    id: 'diff-branch',
    command: 'git diff <branch1>..<branch2>',
    description: 'Compare two branches',
    category: 'diff',
    tags: ['diff', 'branch', 'compare'],
    examples: ['git diff main..develop'],
  },
  {
    id: 'show-commit',
    command: 'git show <commit>',
    description: 'Show commit details',
    category: 'diff',
    tags: ['show', 'commit', 'details'],
  },
  {
    id: 'blame',
    command: 'git blame <file>',
    description: 'Show line-by-line commit history',
    category: 'diff',
    tags: ['blame', 'history', 'author'],
  },

  // Undo Commands
  {
    id: 'restore-file',
    command: 'git restore <file>',
    description: 'Discard changes in working directory',
    category: 'undo',
    tags: ['restore', 'discard', 'undo'],
    examples: ['git restore README.md'],
  },
  {
    id: 'restore-staged',
    command: 'git restore --staged <file>',
    description: 'Unstage file (keep changes)',
    category: 'undo',
    tags: ['restore', 'unstage', 'undo'],
  },
  {
    id: 'reset-soft',
    command: 'git reset --soft HEAD^',
    description: 'Undo last commit, keep changes staged',
    category: 'undo',
    tags: ['reset', 'undo', 'soft', 'commit'],
  },
  {
    id: 'reset-mixed',
    command: 'git reset HEAD^',
    description: 'Undo last commit, keep changes unstaged',
    category: 'undo',
    tags: ['reset', 'undo', 'mixed', 'commit'],
  },
  {
    id: 'reset-hard',
    command: 'git reset --hard HEAD',
    description: 'Discard all local changes',
    category: 'undo',
    tags: ['reset', 'hard', 'discard', 'undo'],
    dangerous: true,
    notes: 'Permanently deletes all uncommitted changes',
  },
  {
    id: 'reset-hard-commit',
    command: 'git reset --hard <commit>',
    description: 'Reset to specific commit, discard changes',
    category: 'undo',
    tags: ['reset', 'hard', 'commit', 'undo'],
    dangerous: true,
  },
  {
    id: 'revert',
    command: 'git revert <commit>',
    description: 'Create new commit that undoes changes',
    category: 'undo',
    tags: ['revert', 'undo', 'commit'],
  },
  {
    id: 'clean',
    command: 'git clean -fd',
    description: 'Remove untracked files and directories',
    category: 'undo',
    tags: ['clean', 'remove', 'untracked'],
    dangerous: true,
    notes: 'Permanently deletes untracked files',
  },

  // Stash Commands
  {
    id: 'stash',
    command: 'git stash',
    description: 'Temporarily save changes',
    category: 'stash',
    tags: ['stash', 'save', 'temporary'],
  },
  {
    id: 'stash-message',
    command: 'git stash save "message"',
    description: 'Stash with descriptive message',
    category: 'stash',
    tags: ['stash', 'save', 'message'],
    examples: ['git stash save "WIP: working on feature"'],
  },
  {
    id: 'stash-list',
    command: 'git stash list',
    description: 'List all stashed changes',
    category: 'stash',
    tags: ['stash', 'list', 'view'],
  },
  {
    id: 'stash-pop',
    command: 'git stash pop',
    description: 'Apply and remove latest stash',
    category: 'stash',
    tags: ['stash', 'pop', 'apply', 'restore'],
  },
  {
    id: 'stash-apply',
    command: 'git stash apply',
    description: 'Apply latest stash (keep in list)',
    category: 'stash',
    tags: ['stash', 'apply', 'restore'],
  },
  {
    id: 'stash-drop',
    command: 'git stash drop',
    description: 'Delete latest stash',
    category: 'stash',
    tags: ['stash', 'drop', 'delete'],
  },
  {
    id: 'stash-clear',
    command: 'git stash clear',
    description: 'Delete all stashes',
    category: 'stash',
    tags: ['stash', 'clear', 'delete', 'all'],
    dangerous: true,
  },

  // Tag Commands
  {
    id: 'tag-list',
    command: 'git tag',
    description: 'List all tags',
    category: 'tag',
    tags: ['tag', 'list', 'view'],
  },
  {
    id: 'tag-create',
    command: 'git tag <tag-name>',
    description: 'Create lightweight tag',
    category: 'tag',
    tags: ['tag', 'create', 'new'],
    examples: ['git tag v1.0.0'],
  },
  {
    id: 'tag-annotated',
    command: 'git tag -a <tag-name> -m "message"',
    description: 'Create annotated tag with message',
    category: 'tag',
    tags: ['tag', 'create', 'annotated'],
    examples: ['git tag -a v1.0.0 -m "Release version 1.0.0"'],
  },
  {
    id: 'tag-push',
    command: 'git push origin <tag-name>',
    description: 'Push tag to remote',
    category: 'tag',
    tags: ['tag', 'push', 'remote'],
  },
  {
    id: 'tag-push-all',
    command: 'git push --tags',
    description: 'Push all tags to remote',
    category: 'tag',
    tags: ['tag', 'push', 'all', 'remote'],
  },
  {
    id: 'tag-delete',
    command: 'git tag -d <tag-name>',
    description: 'Delete local tag',
    category: 'tag',
    tags: ['tag', 'delete', 'remove'],
  },

  // Advanced Commands
  {
    id: 'merge',
    command: 'git merge <branch-name>',
    description: 'Merge branch into current branch',
    category: 'advanced',
    tags: ['merge', 'combine', 'branch'],
    examples: ['git merge feature/new-feature'],
  },
  {
    id: 'merge-no-ff',
    command: 'git merge --no-ff <branch-name>',
    description: 'Merge with merge commit',
    category: 'advanced',
    tags: ['merge', 'no-ff', 'commit'],
  },
  {
    id: 'rebase',
    command: 'git rebase <branch-name>',
    description: 'Rebase current branch onto another',
    category: 'advanced',
    tags: ['rebase', 'branch', 'history'],
    examples: ['git rebase main'],
  },
  {
    id: 'rebase-interactive',
    command: 'git rebase -i HEAD~<n>',
    description: 'Interactive rebase last n commits',
    category: 'advanced',
    tags: ['rebase', 'interactive', 'edit'],
    examples: ['git rebase -i HEAD~3'],
  },
  {
    id: 'cherry-pick',
    command: 'git cherry-pick <commit>',
    description: 'Apply specific commit to current branch',
    category: 'advanced',
    tags: ['cherry-pick', 'commit', 'apply'],
  },
  {
    id: 'reflog',
    command: 'git reflog',
    description: 'Show reference log (recovery tool)',
    category: 'advanced',
    tags: ['reflog', 'log', 'recovery', 'history'],
  },
  {
    id: 'bisect-start',
    command: 'git bisect start',
    description: 'Start binary search for bug',
    category: 'advanced',
    tags: ['bisect', 'debug', 'search'],
  },
];

// Helper functions
export function getCommandById(id: string): GitCommand | undefined {
  return GIT_COMMANDS.find((cmd) => cmd.id === id);
}

export function getCommandsByCategory(category: CommandCategory): GitCommand[] {
  return GIT_COMMANDS.filter((cmd) => cmd.category === category);
}

export function searchCommands(query: string): GitCommand[] {
  const lowerQuery = query.toLowerCase();
  return GIT_COMMANDS.filter(
    (cmd) =>
      cmd.command.toLowerCase().includes(lowerQuery) ||
      cmd.description.toLowerCase().includes(lowerQuery) ||
      cmd.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
