// Fuzzy search configuration using Fuse.js
import Fuse, { type IFuseOptions, type FuseResultMatch } from 'fuse.js';
import type { GitCommand } from '../data/commands';
import type { GitWorkflow } from '../data/workflows';

// Search result type
export interface SearchResult<T> {
  item: T;
  score?: number;
  matches?: readonly FuseResultMatch[];
}

// Fuse.js options for command search
const COMMAND_SEARCH_OPTIONS: IFuseOptions<GitCommand> = {
  keys: [
    { name: 'command', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.4, // Lower = more strict matching
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
  useExtendedSearch: false,
};

// Fuse.js options for workflow search
const WORKFLOW_SEARCH_OPTIONS: IFuseOptions<GitWorkflow> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'steps.command', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
  useExtendedSearch: false,
};

/**
 * Create a Fuse instance for command search
 */
export function createCommandSearcher(commands: GitCommand[]): Fuse<GitCommand> {
  return new Fuse(commands, COMMAND_SEARCH_OPTIONS);
}

/**
 * Create a Fuse instance for workflow search
 */
export function createWorkflowSearcher(workflows: GitWorkflow[]): Fuse<GitWorkflow> {
  return new Fuse(workflows, WORKFLOW_SEARCH_OPTIONS);
}

/**
 * Search commands with fuzzy matching
 */
export function searchCommands(
  searcher: Fuse<GitCommand>,
  query: string
): SearchResult<GitCommand>[] {
  if (!query.trim()) {
    return [];
  }

  const results = searcher.search(query);
  return results.map((result) => ({
    item: result.item,
    score: result.score,
    matches: result.matches,
  }));
}

/**
 * Search workflows with fuzzy matching
 */
export function searchWorkflows(
  searcher: Fuse<GitWorkflow>,
  query: string
): SearchResult<GitWorkflow>[] {
  if (!query.trim()) {
    return [];
  }

  const results = searcher.search(query);
  return results.map((result) => ({
    item: result.item,
    score: result.score,
    matches: result.matches,
  }));
}

/**
 * Combined search across both commands and workflows
 */
export interface CombinedSearchResult {
  commands: SearchResult<GitCommand>[];
  workflows: SearchResult<GitWorkflow>[];
}

export function combinedSearch(
  commandSearcher: Fuse<GitCommand>,
  workflowSearcher: Fuse<GitWorkflow>,
  query: string,
  maxResults: number = 10
): CombinedSearchResult {
  const commands = searchCommands(commandSearcher, query).slice(0, maxResults);
  const workflows = searchWorkflows(workflowSearcher, query).slice(0, maxResults);

  return { commands, workflows };
}

/**
 * Highlight matched text in search results
 */
export function highlightMatches(
  text: string,
  matches?: readonly FuseResultMatch[]
): string {
  if (!matches || matches.length === 0) {
    return text;
  }

  // Sort indices in reverse order to avoid offset issues
  const indices = matches
    .flatMap((match) => match.indices)
    .sort((a, b) => b[0] - a[0]);

  let result = text;
  for (const [start, end] of indices) {
    result =
      result.slice(0, start) +
      '<mark>' +
      result.slice(start, end + 1) +
      '</mark>' +
      result.slice(end + 1);
  }

  return result;
}

/**
 * Get search suggestions based on partial input
 */
export function getSearchSuggestions(
  commandSearcher: Fuse<GitCommand>,
  workflowSearcher: Fuse<GitWorkflow>,
  query: string,
  limit: number = 5
): string[] {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const commandResults = searchCommands(commandSearcher, query).slice(0, limit);
  const workflowResults = searchWorkflows(workflowSearcher, query).slice(0, limit);

  const suggestions = new Set<string>();

  // Extract unique tags from results
  commandResults.forEach((result) => {
    result.item.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(tag);
      }
    });
  });

  workflowResults.forEach((result) => {
    result.item.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(tag);
      }
    });
  });

  return Array.from(suggestions).slice(0, limit);
}
