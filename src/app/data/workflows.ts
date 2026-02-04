/**
 * 情景对外 API：从 scenarios.data + 原子命令解析，保持与原有 GitWorkflow 接口兼容。
 * 新增/修改/删除情景只需改 scenarios.data.ts；步骤通过 commandId 引用原子命令。
 */
import { getAtomicCommandById } from './commands';
import { SCENARIOS_RAW } from './scenarios.data';
import { buildFullCommand } from './types';
import type { WorkflowCategory } from './types';

export type { WorkflowCategory };

export interface WorkflowStep {
  command: string;
  description: string;
  optional?: boolean;
  dangerous?: boolean;
  variables?: string[];
}

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

function toGitWorkflow(raw: (typeof SCENARIOS_RAW)[number]): GitWorkflow {
  const steps: WorkflowStep[] = raw.steps.map((stepRaw) => {
    const atomic = getAtomicCommandById(stepRaw.commandId);
    const command = atomic ? buildFullCommand(atomic) : `# unknown: ${stepRaw.commandId}`;
    const description = atomic?.description_en ?? stepRaw.commandId;
    const variables = stepRaw.variables ?? atomic?.variables;
    return {
      command,
      description,
      optional: stepRaw.optional,
      dangerous: stepRaw.dangerous ?? atomic?.dangerous,
      variables,
    };
  });

  return {
    id: raw.id,
    title: raw.title_cn,
    description: raw.description_cn,
    category: raw.category,
    icon: raw.icon,
    steps,
    tags: raw.tags,
    difficulty: raw.difficulty,
    notes: raw.notes_cn ?? raw.notes_en,
  };
}

/** 由情景数据 + 原子命令解析得到的完整工作流列表（只读） */
export const GIT_WORKFLOWS: GitWorkflow[] = SCENARIOS_RAW.map(toGitWorkflow);

export function getWorkflowById(id: string): GitWorkflow | undefined {
  return GIT_WORKFLOWS.find((w) => w.id === id);
}

export function getWorkflowsByCategory(category: WorkflowCategory): GitWorkflow[] {
  return GIT_WORKFLOWS.filter((w) => w.category === category);
}

export function searchWorkflows(query: string): GitWorkflow[] {
  const lowerQuery = query.toLowerCase();
  return GIT_WORKFLOWS.filter(
    (w) =>
      w.title.toLowerCase().includes(lowerQuery) ||
      w.description.toLowerCase().includes(lowerQuery) ||
      w.tags.some((t) => t.toLowerCase().includes(lowerQuery)) ||
      w.steps.some((s) => s.command.toLowerCase().includes(lowerQuery))
  );
}

export function getWorkflowsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): GitWorkflow[] {
  return GIT_WORKFLOWS.filter((w) => w.difficulty === difficulty);
}
