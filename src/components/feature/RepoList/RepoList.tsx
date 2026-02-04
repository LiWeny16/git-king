// Repository List Component - iOS Style
// Using standard scrolling instead of virtualization for simpler maintenance
import { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Paper, Typography, TextField, InputAdornment, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useGitStore } from '../../../store';
import { RepoListItem } from './RepoListItem';
import type { Repository } from '../../../store/gitStore';

// Configuration
const CONFIG = {
  itemHeight: 72,
  emptyMessage: 'No repositories found',
  searchPlaceholder: 'Search repositories...',
};

interface RepoListProps {
  height?: number;
  width?: string | number;
  showSearch?: boolean;
  onRepoSelect?: (repo: Repository) => void;
  onRepoDelete?: (repoId: string) => void;
  onRepoFavorite?: (repoId: string) => void;
}

export const RepoList = observer(function RepoList({
  height = 400,
  showSearch = true,
  onRepoSelect,
  onRepoDelete,
  onRepoFavorite,
}: RepoListProps) {
  const gitStore = useGitStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter repositories by search query
  const filteredRepos = useMemo(() => {
    if (!searchQuery.trim()) {
      return gitStore.repositories;
    }
    const query = searchQuery.toLowerCase();
    return gitStore.repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.path.toLowerCase().includes(query) ||
        repo.url?.toLowerCase().includes(query)
    );
  }, [gitStore.repositories, searchQuery]);

  // Sort: favorites first, then by last accessed
  const sortedRepos = useMemo(() => {
    return [...filteredRepos].sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1;
      }
      return b.lastAccessed - a.lastAccessed;
    });
  }, [filteredRepos]);

  const listHeight = showSearch ? height - 56 : height;

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* Search bar */}
      {showSearch && (
        <Box
          sx={{
            p: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.background.default, 0.5),
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder={CONFIG.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      )}

      {/* Repository list */}
      {sortedRepos.length > 0 ? (
        <Box
          sx={{
            height: listHeight,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'action.hover',
              borderRadius: 4,
            },
          }}
        >
          {sortedRepos.map((repo) => (
            <Box key={repo.id} sx={{ height: CONFIG.itemHeight }}>
              <RepoListItem
                repo={repo}
                isActive={repo.id === gitStore.currentRepositoryId}
                onClick={() => onRepoSelect?.(repo)}
                onDelete={() => onRepoDelete?.(repo.id)}
                onFavorite={() => onRepoFavorite?.(repo.id)}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            height: listHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2">{CONFIG.emptyMessage}</Typography>
        </Box>
      )}
    </Paper>
  );
});
