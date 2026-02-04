/**
 * 用已配置的变量值替换命令中的占位符；空值不替换，保留占位符。
 */
export function substituteCommand(
  command: string,
  values: Record<string, string>
): string {
  let out = command;
  for (const [placeholder, value] of Object.entries(values)) {
    const trimmed = value?.trim() ?? '';
    if (trimmed === '') continue;
    out = out.split(placeholder).join(trimmed);
  }
  return out;
}
