// Git Repository State Management with MobX and Persistence
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

export interface Repository {
  id: string;
  name: string;
  path: string;
  url?: string;
  branch?: string;
  lastAccessed: number;
  isFavorite: boolean;
}

export class GitStore {
  // Repository list
  repositories: Repository[] = [];

  // Current active repository
  currentRepositoryId: string | null = null;

  // AI Token (optional)
  aiToken: string = '';

  // User preferences
  defaultBranch: string = 'main';
  autoFetch: boolean = false;

  constructor() {
    makeAutoObservable(this);

    // Make store persistent
    makePersistable(this, {
      name: 'GitStore',
      properties: [
        'repositories',
        'currentRepositoryId',
        'aiToken',
        'defaultBranch',
        'autoFetch',
      ],
      storage: window.localStorage,
    });
  }

  // Repository actions
  addRepository(repo: Omit<Repository, 'id' | 'lastAccessed'>) {
    const newRepo: Repository = {
      ...repo,
      id: `repo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastAccessed: Date.now(),
    };
    this.repositories.push(newRepo);
    return newRepo;
  }

  removeRepository(id: string) {
    this.repositories = this.repositories.filter((repo) => repo.id !== id);
    if (this.currentRepositoryId === id) {
      this.currentRepositoryId = null;
    }
  }

  updateRepository(id: string, updates: Partial<Repository>) {
    const index = this.repositories.findIndex((repo) => repo.id === id);
    if (index !== -1) {
      this.repositories[index] = {
        ...this.repositories[index],
        ...updates,
        lastAccessed: Date.now(),
      };
    }
  }

  setCurrentRepository(id: string | null) {
    this.currentRepositoryId = id;
    if (id) {
      this.updateRepository(id, { lastAccessed: Date.now() });
    }
  }  toggleFavorite(id: string) {
    const repo = this.repositories.find((r) => r.id === id);
    if (repo) {
      this.updateRepository(id, { isFavorite: !repo.isFavorite });
    }
  }

  // Get current repository
  get currentRepository(): Repository | null {
    if (!this.currentRepositoryId) return null;
    return this.repositories.find((r) => r.id === this.currentRepositoryId) || null;
  }

  // Get favorite repositories
  get favoriteRepositories(): Repository[] {
    return this.repositories.filter((repo) => repo.isFavorite);
  }

  // Get recent repositories
  get recentRepositories(): Repository[] {
    return [...this.repositories]
      .sort((a, b) => b.lastAccessed - a.lastAccessed)
      .slice(0, 5);
  }

  // AI Token actions
  setAIToken(token: string) {
    this.aiToken = token;
  }

  clearAIToken() {
    this.aiToken = '';
  }

  get hasAIToken(): boolean {
    return this.aiToken.length > 0;
  }

  // Preferences actions
  setDefaultBranch(branch: string) {
    this.defaultBranch = branch;
  }

  toggleAutoFetch() {
    this.autoFetch = !this.autoFetch;
  }

  // Search repositories
  searchRepositories(query: string): Repository[] {
    const lowerQuery = query.toLowerCase();
    return this.repositories.filter(
      (repo) =>
     repo.name.toLowerCase().includes(lowerQuery) ||
        repo.path.toLowerCase().includes(lowerQuery) ||
        repo.url?.toLowerCase().includes(lowerQuery)
    );
  }

  // Reset store
  reset() {
    this.repositories = [];
    this.currentRepositoryId = null;
    this.aiToken = '';
    this.defaultBranch = 'main';
    this.autoFetch = false;
  }
}

// Create singleton instance
export const gitStore = new GitStore();
