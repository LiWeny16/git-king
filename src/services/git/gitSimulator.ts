// Git State Simulator for visualization and learning
// Simulates Git operations without actual repository

export interface Commit {
  id: string;
  hash: string;
  message: string;
  author: string;
  timestamp: number;
  parentIds: string[];
}

export interface Branch {
  name: string;
  headCommitId: string;
  isRemote: boolean;
  upstream?: string;
}

export interface GitState {
  commits: Map<string, Commit>;
  branches: Map<string, Branch>;
  currentBranch: string;
  head: string;
  stagedFiles: string[];
  modifiedFiles: string[];
}

/**
 * Git state simulator for visualization purposes
 */
export class GitSimulator {
  private state: GitState;
  private history: GitState[] = [];

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): GitState {
    const initialCommit: Commit = {
      id: 'c1',
      hash: 'abc1234',
      message: 'Initial commit',
      author: 'user',
      timestamp: Date.now(),
      parentIds: [],
    };

    const commits = new Map<string, Commit>();
    commits.set(initialCommit.id, initialCommit);

    const branches = new Map<string, Branch>();
    branches.set('main', {
      name: 'main',
      headCommitId: initialCommit.id,
      isRemote: false,
    });

    return {
      commits,
      branches,
      currentBranch: 'main',
      head: initialCommit.id,
      stagedFiles: [],
      modifiedFiles: [],
    };
  }

  /**
   * Get current state
   */
  getState(): GitState {
    return { ...this.state };
  }

  /**
   * Save current state to history
   */
  private saveHistory(): void {
    this.history.push({ ...this.state });
    if (this.history.length > 50) {
      this.history.shift();
    }
  }

  /**
   * Undo last operation
   */
  undo(): boolean {
    const previousState = this.history.pop();
    if (previousState) {
      this.state = previousState;
      return true;
    }
    return false;
  }

  /**
   * Generate a short hash
   */
  private generateHash(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  /**
   * Create a new commit
   */
  commit(message: string, author = 'user'): Commit {
    this.saveHistory();

    const newCommit: Commit = {
      id: `c${this.state.commits.size + 1}`,
      hash: this.generateHash(),
      message,
      author,
      timestamp: Date.now(),
      parentIds: [this.state.head],
    };

    this.state.commits.set(newCommit.id, newCommit);
    this.state.head = newCommit.id;

    // Update current branch
    const branch = this.state.branches.get(this.state.currentBranch);
    if (branch) {
      branch.headCommitId = newCommit.id;
    }

    this.state.stagedFiles = [];
    return newCommit;
  }

  /**
   * Create a new branch
   */
  createBranch(name: string, checkout = true): Branch {
    this.saveHistory();

    const newBranch: Branch = {
      name,
      headCommitId: this.state.head,
      isRemote: false,
    };

    this.state.branches.set(name, newBranch);

    if (checkout) {
      this.state.currentBranch = name;
    }

    return newBranch;
  }

  /**
   * Checkout a branch
   */
  checkout(branchName: string): boolean {
    const branch = this.state.branches.get(branchName);
    if (!branch) return false;

    this.saveHistory();
    this.state.currentBranch = branchName;
    this.state.head = branch.headCommitId;
    return true;
  }

  /**
   * Merge a branch into current branch
   */
  merge(sourceBranch: string): Commit | null {
    const source = this.state.branches.get(sourceBranch);
    if (!source) return null;

    this.saveHistory();

    // Create merge commit
    const mergeCommit: Commit = {
      id: `c${this.state.commits.size + 1}`,
      hash: this.generateHash(),
      message: `Merge branch '${sourceBranch}'`,
      author: 'user',
      timestamp: Date.now(),
      parentIds: [this.state.head, source.headCommitId],
    };

    this.state.commits.set(mergeCommit.id, mergeCommit);
    this.state.head = mergeCommit.id;

    // Update current branch
    const currentBranch = this.state.branches.get(this.state.currentBranch);
    if (currentBranch) {
      currentBranch.headCommitId = mergeCommit.id;
    }

    return mergeCommit;
  }

  /**
   * Delete a branch
   */
  deleteBranch(name: string): boolean {
    if (name === this.state.currentBranch) return false;
    if (!this.state.branches.has(name)) return false;

    this.saveHistory();
    this.state.branches.delete(name);
    return true;
  }

  /**
   * Reset to a specific commit
   */
  reset(commitId: string, mode: 'soft' | 'mixed' | 'hard' = 'mixed'): boolean {
    const commit = this.state.commits.get(commitId);
    if (!commit) return false;

    this.saveHistory();
    this.state.head = commitId;

    const currentBranch = this.state.branches.get(this.state.currentBranch);
    if (currentBranch) {
      currentBranch.headCommitId = commitId;
    }

    if (mode === 'hard') {
      this.state.stagedFiles = [];
      this.state.modifiedFiles = [];
    }

    return true;
  }

  /**
   * Get commit history for current branch
   */
  getHistory(limit = 10): Commit[] {
    const history: Commit[] = [];
    let currentId: string | undefined = this.state.head;

    while (currentId && history.length < limit) {
      const commit = this.state.commits.get(currentId);
      if (!commit) break;
      history.push(commit);
      currentId = commit.parentIds[0];
    }

    return history;
  }

  /**
   * Get all branches
   */
  getBranches(): Branch[] {
    return Array.from(this.state.branches.values());
  }

  /**
   * Get all commits for visualization
   */
  getAllCommits(): Commit[] {
    return Array.from(this.state.commits.values());
  }

  /**
   * Reset simulator to initial state
   */
  resetAll(): void {
    this.state = this.createInitialState();
    this.history = [];
  }
}

// Singleton instance
export const gitSimulator = new GitSimulator();
