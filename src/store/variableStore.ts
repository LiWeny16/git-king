// Variable/Form Data Store with MobX and Persistence
// Stores user input for command variables (branch names, commit messages, etc.)
import { makeAutoObservable, reaction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

export interface CommandVariable {
  key: string;
  value: string;
  lastUsed: number;
}

export class VariableStore {
  // Store command variables (e.g., branch names, commit messages)
  variables: Map<string, CommandVariable> = new Map();

  /** 持久化的变量快照（Map 无法直接序列化），用于全局配置如用户名、邮箱等 */
  variablesSnapshot: Record<string, string> = {};

  // Recent values for autocomplete
  recentBranchNames: string[] = [];
  recentCommitMessages: string[] = [];
  recentTags: string[] = [];

  // Max items to keep in history
  maxHistoryItems = 10;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.variablesSnapshot,
      (snap) => {
        this.variables.clear();
        if (snap && typeof snap === 'object')
          for (const [k, v] of Object.entries(snap))
            this.variables.set(k, { key: k, value: v, lastUsed: 0 });
      },
      { fireImmediately: true }
    );

    makePersistable(this, {
      name: 'VariableStore',
      properties: [
        'variablesSnapshot',
        'recentBranchNames',
        'recentCommitMessages',
        'recentTags',
        'maxHistoryItems',
      ],
      storage: window.localStorage,
    });
  }

  // Variable actions
  setVariable(key: string, value: string) {
    this.variables.set(key, {
      key,
      value,
      lastUsed: Date.now(),
    });
    this.variablesSnapshot = { ...this.variablesSnapshot, [key]: value };
  }

  getVariable(key: string): string | undefined {
    return this.variables.get(key)?.value;
  }

  deleteVariable(key: string) {
    this.variables.delete(key);
    const next = { ...this.variablesSnapshot };
    delete next[key];
    this.variablesSnapshot = next;
  }

  clearVariables() {
    this.variables.clear();
    this.variablesSnapshot = {};
  }

  // Branch name history
  addBranchName(name: string) {
    if (!name.trim()) return;

    // Remove if already exists
    this.recentBranchNames = this.recentBranchNames.filter((n) => n !== name);

    // Add to beginning
    this.recentBranchNames.unshift(name);

    // Keep only max items
    if (this.recentBranchNames.length > this.maxHistoryItems) {
      this.recentBranchNames = this.recentBranchNames.slice(0, this.maxHistoryItems);
    }
  }

  getBranchNameSuggestions(query: string): string[] {
    if (!query.trim()) return this.recentBranchNames;

    const lowerQuery = query.toLowerCase();
    return this.recentBranchNames.filter((name) =>
      name.toLowerCase().includes(lowerQuery)
    );
  }

  clearBranchHistory() {
    this.recentBranchNames = [];
  }

  // Commit message history
  addCommitMessage(message: string) {
    if (!message.trim()) return;

    // Remove if already exists
    this.recentCommitMessages = this.recentCommitMessages.filter((m) => m !== message);

    // Add to beginning
    this.recentCommitMessages.unshift(message);

    // Keep only max items
    if (this.recentCommitMessages.length > this.maxHistoryItems) {
      this.recentCommitMessages = this.recentCommitMessages.slice(0, this.maxHistoryItems);
    }
  }

  getCommitMessageSuggestions(query: string): string[] {
    if (!query.trim()) return this.recentCommitMessages;

    const lowerQuery = query.toLowerCase();
    return this.recentCommitMessages.filter((msg) =>
      msg.toLowerCase().includes(lowerQuery)
    );
  }

  clearCommitHistory() {
    this.recentCommitMessages = [];
  }

  // Tag history
  addTag(tag: string) {
    if (!tag.trim()) return;

    // Remove if already exists
    this.recentTags = this.recentTags.filter((t) => t !== tag);

    // Add to beginning
    this.recentTags.unshift(tag);

    // Keep only max items
    if (this.recentTags.length > this.maxHistoryItems) {
      this.recentTags = this.recentTags.slice(0, this.maxHistoryItems);
    }
  }

  getTagSuggestions(query: string): string[] {
    if (!query.trim()) return this.recentTags;

    const lowerQuery = query.toLowerCase();
    return this.recentTags.filter((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    );
  }

  clearTagHistory() {
    this.recentTags = [];
  }

  // Settings
  setMaxHistoryItems(max: number) {
    this.maxHistoryItems = Math.max(1, Math.min(50, max));

    // Trim existing arrays if needed
    if (this.recentBranchNames.length > this.maxHistoryItems) {
      this.recentBranchNames = this.recentBranchNames.slice(0, this.maxHistoryItems);
    }
    if (this.recentCommitMessages.length > this.maxHistoryItems) {
      this.recentCommitMessages = this.recentCommitMessages.slice(0, this.maxHistoryItems);
    }
    if (this.recentTags.length > this.maxHistoryItems) {
      this.recentTags = this.recentTags.slice(0, this.maxHistoryItems);
    }
  }

  // Reset store
  reset() {
    this.variables.clear();
    this.variablesSnapshot = {};
    this.recentBranchNames = [];
    this.recentCommitMessages = [];
    this.recentTags = [];
    this.maxHistoryItems = 10;
  }

  // Clear all history
  clearAllHistory() {
    this.clearBranchHistory();
    this.clearCommitHistory();
    this.clearTagHistory();
  }
}

// Create singleton instance
export const variableStore = new VariableStore();
