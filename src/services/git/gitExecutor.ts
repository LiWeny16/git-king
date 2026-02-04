// Git Command Executor
// Wrapper for executing Git commands (simulation only - no actual execution)

export interface ExecuteResult {
  success: boolean;
  output: string;
  error?: string;
  command: string;
}

/**
 * Git command executor
 * Note: This is a simulation - no actual Git commands are executed
 */
export const gitExecutor = {
  /**
   * Simulate command execution
   */
  execute(command: string): ExecuteResult {
    // Parse command
    const parts = command.trim().split(/\s+/);
    if (parts[0] !== 'git') {
      return {
        success: false,
        output: '',
        error: 'Not a git command',
        command,
      };
    }

    const subCommand = parts[1];
    const args = parts.slice(2);

    // Simulate different commands
    switch (subCommand) {
      case 'status':
        return {
          success: true,
          output: 'On branch main\nnothing to commit, working tree clean',
          command,
        };

      case 'branch':
        return {
          success: true,
          output: '* main\n  develop\n  feature/example',
          command,
        };

      case 'log':
        return {
          success: true,
          output: `abc1234 Initial commit
def5678 Add feature
ghi9012 Fix bug`,
          command,
        };

      case 'config':
        if (args.includes('--list')) {
          return {
            success: true,
            output: `user.name=Git User
user.email=user@example.com
core.editor=code`,
            command,
          };
        }
        return {
          success: true,
          output: '',
          command,
        };

      case 'remote':
        if (args.includes('-v')) {
          return {
            success: true,
            output: `origin\thttps://github.com/user/repo.git (fetch)
origin\thttps://github.com/user/repo.git (push)`,
            command,
          };
        }
        return {
          success: true,
          output: 'origin',
          command,
        };

      case 'diff':
        return {
          success: true,
          output: 'No differences',
          command,
        };

      case 'fetch':
      case 'pull':
      case 'push':
        return {
          success: true,
          output: `Simulated ${subCommand} complete`,
          command,
        };

      case 'checkout':
      case 'switch':
        return {
          success: true,
          output: `Switched to branch '${args[0] || 'main'}'`,
          command,
        };

      case 'commit':
        return {
          success: true,
          output: '[main abc1234] Commit message\n 1 file changed',
          command,
        };

      case 'add':
        return {
          success: true,
          output: '',
          command,
        };

      case 'reset':
        return {
          success: true,
          output: 'HEAD is now at abc1234',
          command,
        };

      case 'stash':
        return {
          success: true,
          output: 'Saved working directory and index state',
          command,
        };

      case 'merge':
        return {
          success: true,
          output: `Merge made by the 'ort' strategy.`,
          command,
        };

      case 'rebase':
        return {
          success: true,
          output: 'Successfully rebased and updated refs/heads/main.',
          command,
        };

      default:
        return {
          success: true,
          output: `Simulated: git ${subCommand} ${args.join(' ')}`,
          command,
        };
    }
  },

  /**
   * Validate command syntax
   */
  validate(command: string): { valid: boolean; error?: string } {
    const trimmed = command.trim();

    if (!trimmed) {
      return { valid: false, error: 'Empty command' };
    }

    if (!trimmed.startsWith('git ')) {
      return { valid: false, error: 'Command must start with "git"' };
    }

    // Check for dangerous commands
    const dangerousPatterns = [
      /git\s+push\s+.*--force/,
      /git\s+push\s+-f/,
      /git\s+reset\s+--hard/,
      /git\s+clean\s+-fd/,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(trimmed)) {
        return {
          valid: true,
          error: '⚠️ This is a dangerous command that may cause data loss',
        };
      }
    }

    return { valid: true };
  },

  /**
   * Format command for display
   */
  format(command: string): string {
    return command.trim().replace(/\s+/g, ' ');
  },
};
