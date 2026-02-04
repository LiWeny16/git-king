// Command Palette (Super Panel) - specs/UIUX.md §3.1
import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Command } from 'cmdk';
import { motion } from 'framer-motion';
import { Box, Paper, Typography, Chip, Stack } from '@mui/material';
import { useUIStore, useVariableStore } from '../../../store';
import { GIT_COMMANDS } from '../../../app/data/commands';
import { GIT_WORKFLOWS } from '../../../app/data/workflows';
import { createCommandSearcher, createWorkflowSearcher, combinedSearch } from '../../../app/utils/search';
import { copyToClipboard, copyWorkflowSteps } from '../../../app/utils/clipboard';
import { substituteCommand } from '../../../app/utils/substituteCommand';
import { Z_INDEX } from '../../../app/constants';
import './CommandPalette.css';

// 入场动画: opacity 0->1, scale 0.96->1, 0.2s ease-out
const PANEL_TRANSITION = { duration: 0.2, ease: 'easeOut' as const };

const CONFIG = {
  maxResults: 8,
  placeholderText: '搜索场景或指令…',
  emptyText: '未找到结果',
  categories: {
    workflows: '场景',
    commands: '指令',
  },
};

export const CommandPalette = observer(() => {
  const uiStore = useUIStore();
  const variableStore = useVariableStore();
  const [selectedItem, setSelectedItem] = useState<string>('');
  const snapshot = variableStore.variablesSnapshot;

  // Create search instances
  const commandSearcher = useMemo(() => createCommandSearcher(GIT_COMMANDS), []);
  const workflowSearcher = useMemo(() => createWorkflowSearcher(GIT_WORKFLOWS), []);

  // Perform search
  const searchResults = useMemo(() => {
    if (!uiStore.searchQuery.trim()) {
      return {
        workflows: GIT_WORKFLOWS.slice(0, 5).map(item => ({ item })),
        commands: GIT_COMMANDS.slice(0, 5).map(item => ({ item })),
      };
    }
    return combinedSearch(commandSearcher, workflowSearcher, uiStore.searchQuery, CONFIG.maxResults);
  }, [uiStore.searchQuery, commandSearcher, workflowSearcher]);

  // Deep linking: 选中 Scenario 时立即关闭，再滚动+高亮首页对应卡片 (specs/UIUX.md §3.1)
  const handleSelect = (value: string) => {
    const [type, id] = value.split(':');

    if (type === 'workflow') {
      const workflow = GIT_WORKFLOWS.find((w) => w.id === id);
      if (workflow) {
        uiStore.closeCommandPalette();
        uiStore.setHighlightScenarioId(workflow.id);
        const substitutedSteps = workflow.steps.map((s) => ({
          command: substituteCommand(s.command, snapshot),
          description: s.description,
        }));
        copyWorkflowSteps(substitutedSteps).then(() => {
          uiStore.showSuccessToast(`已复制场景: ${workflow.title}`);
        });
      }
    } else if (type === 'command') {
      const command = GIT_COMMANDS.find((c) => c.id === id);
      if (command) {
        uiStore.closeCommandPalette();
        const displayCommand = substituteCommand(command.command, snapshot);
        copyToClipboard(displayCommand).then(() => {
          uiStore.showSuccessToast(`已复制: ${displayCommand}`);
        });
      }
    } else {
      uiStore.closeCommandPalette();
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && uiStore.isCommandPaletteOpen) {
        uiStore.closeCommandPalette();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [uiStore]);

  if (!uiStore.isCommandPaletteOpen) return null;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={PANEL_TRANSITION}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: Z_INDEX.COMMAND_PALETTE,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={() => uiStore.closeCommandPalette()}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={PANEL_TRANSITION}
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 720,
          maxHeight: '75vh',
          overflow: 'hidden',
          borderRadius: 3,
          mx: 2,
          boxShadow: '0px 20px 40px -10px rgba(0, 0, 0, 0.15)',
          border: '1px solid',
          borderColor: 'divider',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Command
          value={selectedItem}
          onValueChange={setSelectedItem}
          label="Command Palette"
          className="command-palette"
        >
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderBottom: 1,
              borderColor: 'divider',
              minHeight: 56,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Command.Input
              placeholder={CONFIG.placeholderText}
              value={uiStore.searchQuery}
              onValueChange={(value) => uiStore.setSearchQuery(value)}
              autoFocus
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '17px',
                fontFamily: 'inherit',
                backgroundColor: 'transparent',
                padding: 0,
                lineHeight: 1.5,
              }}
            />
          </Box>

          <Command.List
            style={{
              maxHeight: 'calc(75vh - 88px)',
              overflow: 'auto',
              padding: '12px',
            }}
            className="command-palette-list"
          >
            <Command.Empty>
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {CONFIG.emptyText}
                </Typography>
              </Box>
            </Command.Empty>

            {/* Workflows Section */}
            {searchResults.workflows.length > 0 && (
              <Command.Group heading={CONFIG.categories.workflows}>
                {searchResults.workflows.map((result) => (
                  <Command.Item
                    key={result.item.id}
                    value={`workflow:${result.item.id}`}
                    onSelect={() => handleSelect(`workflow:${result.item.id}`)}
                  >
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {result.item.icon && (
                          <Typography variant="body1">{result.item.icon}</Typography>
                        )}
                        <Typography variant="body1" fontWeight={600}>
                          {result.item.title}
                        </Typography>
                        {result.item.difficulty && (
                          <Chip
                            label={result.item.difficulty}
                            size="small"
                            color={
                              result.item.difficulty === 'beginner'
                                ? 'success'
                                : result.item.difficulty === 'intermediate'
                                ? 'warning'
                                : 'error'
                            }
                            sx={{ height: 20, fontSize: '11px' }}
                          />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {result.item.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontFamily: 'monospace',
                          backgroundColor: 'action.hover',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: 'inline-block',
                        }}
                      >
                        {result.item.steps.length} steps
                      </Typography>
                    </Stack>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Commands Section */}
            {searchResults.commands.length > 0 && (
              <Command.Group heading={CONFIG.categories.commands}>
                {searchResults.commands.map((result) => {
                  const displayCommand = substituteCommand(result.item.command, snapshot);
                  return (
                    <Command.Item
                      key={result.item.id}
                      value={`command:${result.item.id}`}
                      onSelect={() => handleSelect(`command:${result.item.id}`)}
                    >
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 600,
                              color: 'primary.main',
                            }}
                          >
                            {displayCommand}
                          </Typography>
                          {result.item.dangerous && (
                            <Chip
                              label="⚠️"
                              size="small"
                              color="error"
                              sx={{ height: 20, fontSize: '11px' }}
                            />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {result.item.description}
                        </Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {result.item.tags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ height: 18, fontSize: '10px' }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </Paper>
    </Box>
  );
});

CommandPalette.displayName = 'CommandPalette';
