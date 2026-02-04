/**
 * 原子命令 / 情景 的 JSON 结构类型定义
 * 用于与 data 层解耦，便于增删改查命令与情景
 */

// ---------- 原子命令 (Atomic Command) ----------

export type CommandCategory =
  | 'init'
  | 'branch'
  | 'commit'
  | 'remote'
  | 'diff'
  | 'undo'
  | 'stash'
  | 'tag'
  | 'advanced'
  | 'config';

/** 原子命令：一条 JSON 对应一个 git 原子操作，中英文描述 + 可选的 params 拆解 */
export interface AtomicCommandRaw {
  id: string;
  /** 基础命令，如 "git push"、"git config" */
  command: string;
  /** 参数列表，顺序拼接后与 command 组成完整命令行；可含占位符如 "Your Name"、"\<branch-name\>" */
  params?: string[];
  description_en: string;
  description_cn: string;
  category: CommandCategory;
  tags?: string[];
  /** 命令中的占位符列表，用于配置弹窗与变量替换 */
  variables?: string[];
  dangerous?: boolean;
  notes_en?: string;
  notes_cn?: string;
  /** 若提供则优先使用，不通过 command + params 拼接（用于格式复杂的命令） */
  fullCommand?: string;
}

/** 从原子命令构建完整命令行（用于展示/复制） */
export function buildFullCommand(atomic: AtomicCommandRaw): string {
  if (atomic.fullCommand != null && atomic.fullCommand !== '') {
    return atomic.fullCommand;
  }
  const parts = [atomic.command, ...(atomic.params ?? [])];
  return parts.join(' ');
}

// ---------- 情景 (Scenario / Workflow) ----------

export type WorkflowCategory =
  | 'setup'
  | 'start'
  | 'daily'
  | 'collaboration'
  | 'fix'
  | 'release'
  | 'maintenance';

/** 情景步骤：仅引用 commandId，可选覆盖 variables / optional / dangerous */
export interface ScenarioStepRaw {
  commandId: string;
  variables?: string[];
  optional?: boolean;
  dangerous?: boolean;
}

/** 情景：一个 JSON 块描述一个完整流程，步骤通过 commandId 引用原子命令 */
export interface ScenarioRaw {
  id: string;
  title_cn: string;
  title_en: string;
  description_cn: string;
  description_en: string;
  category: WorkflowCategory;
  icon?: string;
  tags: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  steps: ScenarioStepRaw[];
  notes_cn?: string;
  notes_en?: string;
}
