// AI Prompt templates for Git assistance

export interface PromptContext {
  currentBranch?: string;
  repoName?: string;
  recentCommits?: string[];
  stagedFiles?: string[];
}

/**
 * System prompts for different contexts
 */
export const promptTemplates = {
  default: `You are Git King, an expert Git assistant. Help users with Git commands and workflows.

When suggesting actions, you can use this format to create actionable buttons:
:::action{type="checkout", source="main"}:::
:::action{type="merge", source="feature", target="main"}:::
:::action{type="custom", command="git stash pop", label="Restore stash"}:::

Available action types: merge, checkout, commit, push, custom
Be concise and practical. Use code blocks for commands.`,

  troubleshooting: `You are Git King, specializing in Git troubleshooting.
Help users recover from common Git mistakes and conflicts.
Always explain the implications of dangerous operations like force push or hard reset.
Provide step-by-step recovery instructions.`,

  workflow: `You are Git King, a Git workflow expert.
Help users understand and implement Git workflows like:
- Feature branch workflow
- Gitflow
- Trunk-based development
- Fork and pull request workflow

Explain best practices and common pitfalls.`,

  learning: `You are Git King, a patient Git teacher.
Explain Git concepts clearly with analogies and examples.
Start from basics and build up to advanced topics.
Use diagrams in ASCII art when helpful.`,
};

/**
 * Build a prompt with context
 */
export function buildPrompt(
  userQuery: string,
  context?: PromptContext,
  _template: keyof typeof promptTemplates = 'default'
): string {
  let prompt = userQuery;

  if (context) {
    const contextParts: string[] = [];

    if (context.currentBranch) {
      contextParts.push(`Current branch: ${context.currentBranch}`);
    }
    if (context.repoName) {
      contextParts.push(`Repository: ${context.repoName}`);
    }
    if (context.recentCommits?.length) {
      contextParts.push(`Recent commits:\n${context.recentCommits.join('\n')}`);
    }
    if (context.stagedFiles?.length) {
      contextParts.push(`Staged files: ${context.stagedFiles.join(', ')}`);
    }

    if (contextParts.length > 0) {
      prompt = `Context:\n${contextParts.join('\n')}\n\nQuestion: ${userQuery}`;
    }
  }

  return prompt;
}

/**
 * Generate prompt for specific Git scenarios
 */
export const scenarioPrompts = {
  undoLastCommit: 'How do I undo my last commit but keep the changes?',
  resolveConflict: 'I have merge conflicts. How do I resolve them step by step?',
  forceUpdate: 'How do I force update my local branch with the remote?',
  squashCommits: 'How do I squash my last N commits into one?',
  revertFile: 'How do I revert a specific file to its state in the last commit?',
  cherryPick: 'How do I cherry-pick a specific commit from another branch?',
  stashChanges: 'How do I stash my changes and apply them later?',
  cleanupBranches: 'How do I clean up old merged branches?',
};
