/**
 * Home page view adapter: maps app/data (commands + workflows) to the shapes
 * used by the main App UI (scenario sections + command categories).
 */
import type { CommandCategory } from './commands';
import type { WorkflowCategory } from './workflows';
import { getCommandsByCategory } from './commands';
import { GIT_WORKFLOWS } from './workflows';

// --- Scenario sections (from workflows) ---

export const SCENARIO_SECTION_TITLES: Record<string, string> = {
  '初始化与配置': '初始化与配置',
  '分支与协作': '分支与协作',
  '提交与撤销': '提交与撤销',
  '临时保存与恢复': '临时保存与恢复',
} as const;

/** Which workflow categories belong to which display section */
const WORKFLOW_CATEGORY_TO_SECTION: Record<WorkflowCategory, string> = {
  setup: '初始化与配置',
  start: '初始化与配置',
  daily: '提交与撤销', // overridden below for stash
  collaboration: '分支与协作',
  fix: '提交与撤销',
  release: '提交与撤销',
  maintenance: '分支与协作',
};

function getWorkflowSection(workflow: (typeof GIT_WORKFLOWS)[number]): string {
  if (workflow.tags.some((t) => t === 'stash')) return '临时保存与恢复';
  return WORKFLOW_CATEGORY_TO_SECTION[workflow.category];
}

export interface ScenarioStep {
  command: string;
  description: string;
}

export interface ScenarioItem {
  id: string; // workflow id，用于深度链接与高亮
  title: string;
  description: string;
  /** 用于流程连接器与 Modifier Peek 的步骤列表 */
  steps: ScenarioStep[];
}

export interface ScenarioSection {
  title: string;
  items: ScenarioItem[];
}

export function getScenarioSections(): ScenarioSection[] {
  const bySection = new Map<string, ScenarioItem[]>();

  for (const w of GIT_WORKFLOWS) {
    const sectionTitle = getWorkflowSection(w);
    const item: ScenarioItem = {
      id: w.id,
      title: w.title,
      description: w.description,
      steps: w.steps.map((s) => ({ command: s.command, description: s.description })),
    };
    const list = bySection.get(sectionTitle) ?? [];
    list.push(item);
    bySection.set(sectionTitle, list);
  }

  const order: string[] = [
    '初始化与配置',
    '分支与协作',
    '提交与撤销',
    '临时保存与恢复',
  ];
  return order
    .filter((title) => (bySection.get(title)?.length ?? 0) > 0)
    .map((title) => ({
      title,
      items: bySection.get(title) ?? [],
    }));
}

// --- Command categories (from commands) ---

export interface CommandCategoryItem {
  command: string;
  description: string;
}

export interface CommandCategorySection {
  title: string;
  commands: CommandCategoryItem[];
}

/** Map data layer category to display category title + which categories to include */
const COMMAND_DISPLAY_GROUPS: { title: string; categories: CommandCategory[] }[] = [
  { title: '基础命令', categories: ['config', 'init', 'commit'] },
  { title: '分支管理', categories: ['branch'] },
  { title: '远程操作', categories: ['remote'] },
  { title: '查看与对比', categories: ['diff'] },
  { title: '撤销与回退', categories: ['undo'] },
  { title: '标签与暂存', categories: ['stash', 'tag'] },
  { title: '高级操作', categories: ['advanced'] },
];

export function getCommandCategorySections(): CommandCategorySection[] {
  return COMMAND_DISPLAY_GROUPS.map(({ title, categories }) => {
    const commands: CommandCategoryItem[] = [];
    for (const cat of categories) {
      const list = getCommandsByCategory(cat);
      for (const c of list) {
        commands.push({ command: c.command, description: c.description });
      }
    }
    return { title, commands };
  }).filter((s) => s.commands.length > 0);
}
