// Chinese translations (简体中文)
const zh = {
  // App
  app: {
    title: 'Git King',
    subtitle: '你的智能 Git 副驾驶',
    description: '场景化驱动的智能 Git 工作流助手',
  },

  // Navigation
  nav: {
    home: '首页',
    commands: '命令',
    workflows: '工作流',
    history: '历史',
    settings: '设置',
    aiAssistant: 'AI 助手',
  },

  // Common actions
  actions: {
    copy: '复制',
    copied: '已复制！',
    search: '搜索',
    close: '关闭',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    remove: '移除',
    execute: '执行',
  },

  // Command palette
  commandPalette: {
    placeholder: '搜索命令和工作流...',
    empty: '未找到结果',
    hint: '输入搜索，按 Enter 执行',
    categories: {
      workflows: '工作流',
      commands: '命令',
      repos: '仓库',
    },
  },

  // Scenarios
  scenarios: {
    setup: {
      title: '初始化与配置',
      configUser: '配置 Git 用户',
      configUserDesc: '设置全局用户名和邮箱',
      cloneRepo: '克隆仓库',
      cloneRepoDesc: '从远程克隆仓库到本地',
      initRepo: '初始化仓库',
      initRepoDesc: '创建新的本地 Git 仓库',
    },
    branching: {
      title: '分支管理',
      createBranch: '创建新分支',
      createBranchDesc: '创建并切换到新的功能分支',
      switchBranch: '切换分支',
      switchBranchDesc: '切换到已有分支',
      deleteBranch: '删除分支',
      deleteBranchDesc: '删除已合并的分支',
    },
    sync: {
      title: '提交与同步',
      commit: '提交更改',
      commitDesc: '暂存并提交你的更改',
      push: '推送到远程',
      pushDesc: '推送本地提交到远程仓库',
      pull: '拉取更新',
      pullDesc: '获取并合并远程更改',
    },
    undo: {
      title: '撤销与修复',
      amendCommit: '修改最近提交',
      amendCommitDesc: '修改最近一次提交的信息',
      resetSoft: '重置（保留更改）',
      resetSoftDesc: '撤销提交但保留文件更改',
      resetHard: '重置（丢弃所有）',
      resetHardDesc: '完全丢弃所有本地更改',
    },
    merge: {
      title: '合并与变基',
      mergeBranch: '合并分支',
      mergeBranchDesc: '将其他分支合并到当前分支',
      rebase: '变基',
      rebaseDesc: '将当前分支变基到另一个分支',
      cherryPick: 'Cherry Pick',
      cherryPickDesc: '将特定提交应用到当前分支',
    },
  },

  // Settings
  settings: {
    title: '设置',
    general: '通用',
    appearance: '外观',
    aiConfig: 'AI 配置',
    apiToken: 'API 令牌',
    apiTokenPlaceholder: '输入你的 OpenAI API 令牌',
    language: '语言',
    theme: '主题',
    darkMode: '深色模式',
    lightMode: '浅色模式',
    autoMode: '跟随系统',
  },

  // AI Chat
  ai: {
    title: 'AI 助手',
    welcome: '你好！我是你的 Git 助手。可以问我任何关于 Git 命令、工作流或故障排除的问题。',
    placeholder: '询问 Git 相关问题...',
    thinking: '思考中...',
    error: '出了点问题，请重试。',
    noToken: '请在设置中配置 AI API 令牌。',
  },

  // Errors
  errors: {
    copyFailed: '复制到剪贴板失败',
    loadFailed: '加载数据失败',
    saveFailed: '保存更改失败',
    networkError: '网络错误，请检查连接。',
  },

  // Success messages
  success: {
    copied: '已复制到剪贴板！',
    saved: '更改保存成功',
    deleted: '删除成功',
  },
};

export default zh;
