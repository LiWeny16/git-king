// Scenario-based Git workflows
// Each workflow represents a common use case with a sequence of commands

export interface GitWorkflow {
  id: string;
  title: string;
  description: string;
  category: WorkflowCategory;
  icon?: string;
  steps: WorkflowStep[];
  tags: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  notes?: string;
}

export interface WorkflowStep {
  command: string;
  description: string;
  optional?: boolean;
  dangerous?: boolean;
  variables?: string[];
}

export type WorkflowCategory =
  | 'setup'
  | 'start'
  | 'daily'
  | 'collaboration'
  | 'fix'
  | 'release'
  | 'maintenance';

// Comprehensive workflow library
export const GIT_WORKFLOWS: GitWorkflow[] = [
  // Setup Workflows
  {
    id: 'first-time-setup',
    title: '首次配置 Git 用户名与邮箱',
    description: '为全局提交记录设置身份信息',
    category: 'setup',
    icon: '⚙️',
    difficulty: 'beginner',
    tags: ['setup', 'config', 'first-time', 'identity'],
    steps: [
      {
        command: 'git config --global user.name "Your Name"',
        description: 'Set your name for all commits',
        variables: ['Your Name'],
      },
      {
        command: 'git config --global user.email "you@example.com"',
        description: 'Set your email for all commits',
        variables: ['you@example.com'],
      },
      {
        command: 'git config --global color.ui true',
        description: 'Enable colored output',
        optional: true,
      },
      {
        command: 'git config --list',
        description: 'Verify your configuration',
        optional: true,
      },
    ],
  },
  {
    id: 'clone-repository',
    title: '克隆远程仓库',
    description: '从远程仓库拉取完整历史到本地',
    category: 'setup',
    icon: '📥',
    difficulty: 'beginner',
    tags: ['clone', 'download', 'remote', 'start'],
    steps: [
      {
        command: 'git clone <url>',
        description: 'Clone the repository',
        variables: ['<url>'],
      },
      {
        command: 'cd <repository-name>',
        description: 'Navigate into the repository',
        variables: ['<repository-name>'],
      },
      {
        command: 'git status',
        description: 'Check repository status',
        optional: true,
      },
    ],
  },
  {
    id: 'init-and-connect',
    title: '初始化仓库并关联远程',
    description: '创建本地仓库并连接到远程服务器',
    category: 'setup',
    icon: '🔗',
    difficulty: 'beginner',
    tags: ['init', 'remote', 'connect', 'new'],
    steps: [
      {
        command: 'git init',
        description: 'Initialize local repository',
      },
      {
        command: 'git remote add origin <url>',
        description: 'Link to remote repository',
        variables: ['<url>'],
      },
      {
        command: 'git remote -v',
        description: 'Verify remote connection',
        optional: true,
      },
    ],
  },

  // Daily Workflows
  {
    id: 'start-new-day',
    title: '开始新的一天',
    description: '同步远程更新并准备工作',
    category: 'daily',
    icon: '☀️',
    difficulty: 'beginner',
    tags: ['daily', 'sync', 'pull', 'start'],
    steps: [
      {
        command: 'git status',
        description: 'Check current status',
      },
      {
        command: 'git fetch',
        description: 'Fetch remote updates',
      },
      {
        command: 'git pull --rebase',
        description: 'Pull and rebase local commits',
      },
      {
        command: 'git log --oneline -5',
        description: 'Review recent commits',
        optional: true,
      },
    ],
  },
  {
    id: 'create-feature-branch',
    title: '新建功能分支并推送',
    description: '从主干创建分支并设置上游跟踪',
    category: 'start',
    icon: '✨',
    difficulty: 'beginner',
    tags: ['branch', 'feature', 'new', 'create'],
    steps: [
      {
        command: 'git checkout main',
        description: 'Switch to main branch',
      },
      {
        command: 'git pull',
        description: 'Update main branch',
      },
      {
        command: 'git checkout -b <branch-name>',
        description: 'Create and switch to new branch',
        variables: ['<branch-name>'],
      },
      {
        command: 'git push -u origin <branch-name>',
        description: 'Push and set upstream tracking',
        variables: ['<branch-name>'],
      },
    ],
  },
  {
    id: 'commit-and-push',
    title: '提交代码并推送',
    description: '标准提交流程与远程同步',
    category: 'daily',
    icon: '💾',
    difficulty: 'beginner',
    tags: ['commit', 'push', 'save', 'sync'],
    steps: [
      {
        command: 'git status',
        description: 'Check what changed',
      },
      {
        command: 'git add .',
        description: 'Stage all changes',
      },
      {
        command: 'git commit -m "message"',
        description: 'Commit with descriptive message',
        variables: ['message'],
      },
      {
        command: 'git push',
        description: 'Push to remote repository',
      },
    ],
  },

  // Collaboration Workflows
  {
    id: 'sync-with-remote',
    title: '同步远程并合并',
    description: '先获取远程更新，再合并到当前分支',
    category: 'collaboration',
    icon: '🔄',
    difficulty: 'intermediate',
    tags: ['sync', 'fetch', 'merge', 'remote'],
    steps: [
      {
        command: 'git fetch',
        description: 'Fetch remote changes',
      },
      {
        command: 'git status',
        description: 'Check if behind remote',
      },
      {
        command: 'git merge origin/<branch-name>',
        description: 'Merge remote branch',
        variables: ['<branch-name>'],
      },
      {
        command: 'git push',
        description: 'Push merged changes',
        optional: true,
      },
    ],
  },
  {
    id: 'merge-feature-branch',
    title: '合并功能分支到主干',
    description: '将完成的功能合并回主分支',
    category: 'collaboration',
    icon: '🔀',
    difficulty: 'intermediate',
    tags: ['merge', 'feature', 'main', 'complete'],
    steps: [
      {
        command: 'git checkout main',
        description: 'Switch to main branch',
      },
      {
        command: 'git pull',
        description: 'Update main branch',
      },
      {
        command: 'git merge --no-ff <branch-name>',
        description: 'Merge feature branch',
        variables: ['<branch-name>'],
      },
      {
        command: 'git push',
        description: 'Push merged changes',
      },
      {
        command: 'git branch -d <branch-name>',
        description: 'Delete local feature branch',
        variables: ['<branch-name>'],
        optional: true,
      },
    ],
  },
  {
    id: 'delete-merged-branch',
    title: '删除已合并分支',
    description: '清理已完成的本地与远程分支',
    category: 'maintenance',
    icon: '🗑️',
    difficulty: 'beginner',
    tags: ['delete', 'branch', 'cleanup', 'maintenance'],
    steps: [
      {
        command: 'git branch -d <branch-name>',
        description: 'Delete local branch',
        variables: ['<branch-name>'],
      },
      {
        command: 'git push origin --delete <branch-name>',
        description: 'Delete remote branch',
        variables: ['<branch-name>'],
      },
      {
        command: 'git fetch --prune',
        description: 'Clean up remote tracking branches',
        optional: true,
      },
    ],
  },

  // Fix Workflows
  {
    id: 'fix-commit-message',
    title: '修改最近一次提交信息',
    description: '修正刚才提交的 message',
    category: 'fix',
    icon: '✏️',
    difficulty: 'beginner',
    tags: ['fix', 'amend', 'commit', 'message'],
    steps: [
      {
        command: 'git commit --amend -m "message"',
        description: 'Amend last commit message',
        variables: ['message'],
      },
      {
        command: 'git push --force',
        description: 'Force push if already pushed',
        optional: true,
        dangerous: true,
      },
    ],
    notes: 'Only use force push if you are the only one working on the branch',
  },
  {
    id: 'undo-last-commit-keep-changes',
    title: '回退到上个版本但保留代码',
    description: '保留改动，撤销提交历史',
    category: 'fix',
    icon: '↩️',
    difficulty: 'intermediate',
    tags: ['undo', 'reset', 'soft', 'keep'],
    steps: [
      {
        command: 'git reset --soft HEAD^',
        description: 'Undo commit, keep changes staged',
      },
      {
        command: 'git status',
        description: 'Verify changes are still staged',
        optional: true,
      },
    ],
  },
  {
    id: 'discard-all-changes',
    title: '彻底放弃本地修改',
    description: '将工作区恢复到最新提交',
    category: 'fix',
    icon: '🚑',
    difficulty: 'beginner',
    tags: ['discard', 'reset', 'hard', 'undo'],
    steps: [
      {
        command: 'git status',
        description: 'Check what will be discarded',
      },
      {
        command: 'git reset --hard HEAD',
        description: 'Discard all local changes',
        dangerous: true,
      },
      {
        command: 'git clean -fd',
        description: 'Remove untracked files',
        optional: true,
        dangerous: true,
      },
    ],
    notes: 'WARNING: This permanently deletes all uncommitted changes',
  },
  {
    id: 'undo-specific-file',
    title: '撤销单个文件的修改',
    description: '恢复特定文件到最新提交状态',
    category: 'fix',
    icon: '📄',
    difficulty: 'beginner',
    tags: ['undo', 'restore', 'file', 'discard'],
    steps: [
      {
        command: 'git status',
        description: 'Check modified files',
      },
      {
        command: 'git restore <file>',
        description: 'Restore specific file',
        variables: ['<file>'],
      },
    ],
  },
  {
    id: 'revert-commit',
    title: '安全撤销已推送的提交',
    description: '创建新提交来撤销之前的更改',
    category: 'fix',
    icon: '⏮️',
    difficulty: 'intermediate',
    tags: ['revert', 'undo', 'safe', 'commit'],
    steps: [
      {
        command: 'git log --oneline',
        description: 'Find commit to revert',
      },
      {
        command: 'git revert <commit>',
        description: 'Create revert commit',
        variables: ['<commit>'],
      },
      {
        command: 'git push',
        description: 'Push revert commit',
      },
    ],
  },

  // Stash Workflows
  {
    id: 'stash-work-in-progress',
    title: '临时保存正在进行的改动',
    description: '切换任务前快速保存工作区',
    category: 'daily',
    icon: '📦',
    difficulty: 'beginner',
    tags: ['stash', 'save', 'temporary', 'wip'],
    steps: [
      {
        command: 'git status',
        description: 'Check current changes',
      },
      {
        command: 'git stash save "WIP: description"',
        description: 'Stash with descriptive message',
        variables: ['description'],
      },
      {
        command: 'git stash list',
        description: 'Verify stash was created',
        optional: true,
      },
    ],
  },
  {
    id: 'restore-stashed-work',
    title: '恢复刚才的工作',
    description: '从暂存栈恢复最近一次保存',
    category: 'daily',
    icon: '📤',
    difficulty: 'beginner',
    tags: ['stash', 'restore', 'pop', 'apply'],
    steps: [
      {
        command: 'git stash list',
        description: 'List all stashes',
      },
      {
        command: 'git stash pop',
        description: 'Apply and remove latest stash',
      },
      {
        command: 'git status',
        description: 'Check restored changes',
        optional: true,
      },
    ],
  },

  // Release Workflows
  {
    id: 'create-release-tag',
    title: '创建发布标签',
    description: '为重要版本打标签并推送',
    category: 'release',
    icon: '🏷️',
    difficulty: 'intermediate',
    tags: ['tag', 'release', 'version'],
    steps: [
      {
        command: 'git checkout main',
        description: 'Switch to main branch',
      },
      {
        command: 'git pull',
        description: 'Ensure branch is up to date',
      },
      {
        command: 'git tag -a v<version> -m "Release <version>"',
        description: 'Create annotated tag',
        variables: ['<version>'],
      },
      {
        command: 'git push origin v<version>',
        description: 'Push tag to remote',
        variables: ['<version>'],
      },
    ],
  },
  {
    id: 'hotfix-workflow',
    title: '紧急修复流程',
    description: '快速修复生产环境问题',
    category: 'fix',
    icon: '🔥',
    difficulty: 'advanced',
    tags: ['hotfix', 'emergency', 'production', 'urgent'],
    steps: [
      {
        command: 'git checkout main',
        description: 'Start from main branch',
      },
      {
        command: 'git checkout -b hotfix/<issue>',
        description: 'Create hotfix branch',
        variables: ['<issue>'],
      },
      {
        command: 'git add .',
        description: 'Stage the fix',
      },
      {
        command: 'git commit -m "hotfix: description"',
        description: 'Commit the fix',
        variables: ['description'],
      },
      {
        command: 'git checkout main',
        description: 'Switch back to main',
      },
      {
        command: 'git merge --no-ff hotfix/<issue>',
        description: 'Merge hotfix',
        variables: ['<issue>'],
      },
      {
        command: 'git push',
        description: 'Push to production',
      },
      {
        command: 'git branch -d hotfix/<issue>',
        description: 'Delete hotfix branch',
        variables: ['<issue>'],
      },
    ],
  },

  // Advanced Workflows
  {
    id: 'rebase-feature-branch',
    title: '变基功能分支',
    description: '将功能分支变基到最新主干',
    category: 'collaboration',
    icon: '🔧',
    difficulty: 'advanced',
    tags: ['rebase', 'feature', 'update', 'advanced'],
    steps: [
      {
        command: 'git checkout <feature-branch>',
        description: 'Switch to feature branch',
        variables: ['<feature-branch>'],
      },
      {
        command: 'git fetch',
        description: 'Fetch latest changes',
      },
      {
        command: 'git rebase origin/main',
        description: 'Rebase onto main',
      },
      {
        command: 'git push --force-with-lease',
        description: 'Force push with safety check',
        dangerous: true,
      },
    ],
    notes: 'Use --force-with-lease instead of --force for safer force pushing',
  },
  {
    id: 'cherry-pick-commit',
    title: '挑选特定提交',
    description: '将其他分支的提交应用到当前分支',
    category: 'collaboration',
    icon: '🍒',
    difficulty: 'advanced',
    tags: ['cherry-pick', 'commit', 'apply', 'advanced'],
    steps: [
      {
        command: 'git log --oneline --all',
        description: 'Find commit to cherry-pick',
      },
      {
        command: 'git cherry-pick <commit>',
        description: 'Apply specific commit',
        variables: ['<commit>'],
      },
      {
        command: 'git push',
        description: 'Push cherry-picked commit',
        optional: true,
      },
    ],
  },
  {
    id: 'interactive-rebase',
    title: '交互式整理提交历史',
    description: '合并、编辑或删除最近的提交',
    category: 'maintenance',
    icon: '📝',
    difficulty: 'advanced',
    tags: ['rebase', 'interactive', 'history', 'squash'],
    steps: [
      {
        command: 'git log --oneline -10',
        description: 'Review recent commits',
      },
      {
        command: 'git rebase -i HEAD~<n>',
        description: 'Start interactive rebase',
        variables: ['<n>'],
      },
      {
        command: 'git push --force-with-lease',
        description: 'Force push cleaned history',
        optional: true,
        dangerous: true,
      },
    ],
    notes: 'Never rebase commits that have been pushed to shared branches',
  },

  // Maintenance Workflows
  {
    id: 'cleanup-branches',
    title: '清理本地分支',
    description: '删除已合并和过时的本地分支',
    category: 'maintenance',
    icon: '🧹',
    difficulty: 'intermediate',
    tags: ['cleanup', 'branch', 'maintenance', 'prune'],
    steps: [
      {
        command: 'git fetch --prune',
        description: 'Update remote tracking branches',
      },
      {
        command: 'git branch --merged',
        description: 'List merged branches',
      },
      {
        command: 'git branch -d <branch-name>',
        description: 'Delete merged branches',
        variables: ['<branch-name>'],
      },
    ],
  },
  {
    id: 'view-commit-history',
    title: '查看提交历史',
    description: '以图形化方式查看分支和提交',
    category: 'daily',
    icon: '📊',
    difficulty: 'beginner',
    tags: ['log', 'history', 'view', 'graph'],
    steps: [
      {
        command: 'git log --graph --oneline --all',
        description: 'Show commit graph',
      },
      {
        command: 'git log --stat',
        description: 'Show files changed in each commit',
        optional: true,
      },
    ],
  },
];

// Helper functions
export function getWorkflowById(id: string): GitWorkflow | undefined {
  return GIT_WORKFLOWS.find((workflow) => workflow.id === id);
}

export function getWorkflowsByCategory(category: WorkflowCategory): GitWorkflow[] {
  return GIT_WORKFLOWS.filter((workflow) => workflow.category === category);
}

export function searchWorkflows(query: string): GitWorkflow[] {
  const lowerQuery = query.toLowerCase();
  return GIT_WORKFLOWS.filter(
    (workflow) =>
      workflow.title.toLowerCase().includes(lowerQuery) ||
      workflow.description.toLowerCase().includes(lowerQuery) ||
      workflow.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      workflow.steps.some((step) => step.command.toLowerCase().includes(lowerQuery))
  );
}

export function getWorkflowsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): GitWorkflow[] {
  return GIT_WORKFLOWS.filter((workflow) => workflow.difficulty === difficulty);
}
