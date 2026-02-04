/**
 * 原子命令对外 API：从 commands.data 构建，保持与原有 GitCommand 接口兼容。
 * 新增/修改/删除命令只需改 commands.data.ts。
 */
import { ATOMIC_COMMANDS } from './commands.data';
import { buildFullCommand } from './types';
import type { CommandCategory } from './types';

export type { CommandCategory };

export interface GitCommand {
  id: string;
  command: string;
  description: string;
  category: CommandCategory;
  tags: string[];
  examples?: string[];
  notes?: string;
  dangerous?: boolean;
}

function toGitCommand(atomic: (typeof ATOMIC_COMMANDS)[number]): GitCommand {
  const fullCommand = buildFullCommand(atomic);
  return {
    id: atomic.id,
    command: fullCommand,
    description: atomic.description_en,
    category: atomic.category,
    tags: atomic.tags ?? [],
    notes: atomic.notes_en ?? atomic.notes_cn,
    dangerous: atomic.dangerous,
  };
}

/** 由原子命令数据构建的完整命令列表（只读） */
export const GIT_COMMANDS: GitCommand[] = ATOMIC_COMMANDS.map(toGitCommand);

export function getCommandById(id: string): GitCommand | undefined {
  return GIT_COMMANDS.find((cmd) => cmd.id === id);
}

export function getCommandsByCategory(category: CommandCategory): GitCommand[] {
  return GIT_COMMANDS.filter((cmd) => cmd.category === category);
}

export function searchCommands(query: string): GitCommand[] {
  const lowerQuery = query.toLowerCase();
  return GIT_COMMANDS.filter(
    (cmd) =>
      cmd.command.toLowerCase().includes(lowerQuery) ||
      cmd.description.toLowerCase().includes(lowerQuery) ||
      cmd.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/** 根据 id 获取原子命令原始数据（供 workflows 解析步骤用） */
export function getAtomicCommandById(id: string) {
  return ATOMIC_COMMANDS.find((c) => c.id === id);
}
