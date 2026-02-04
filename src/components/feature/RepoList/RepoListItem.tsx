// Repository List Item Component - iOS Inset Grouped Style
import { Box, IconButton, Typography, Tooltip, alpha } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { Repository } from '../../../store/gitStore';

// Configuration
const CONFIG = {
  pathMaxLength: 40,
  branchMaxLength: 20,
};

interface RepoListItemProps {
  repo: Repository;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onFavorite?: () => void;
}

export function RepoListItem({
  repo,
  isActive = false,
  onClick,
  onDelete,
  onFavorite,
}: RepoListItemProps) {
  // Truncate path if too long
  const displayPath =
    repo.path.length > CONFIG.pathMaxLength
      ? `...${repo.path.slice(-CONFIG.pathMaxLength)}`
      : repo.path;

  // Format last accessed time
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        mx: 1,
        my: 0.5,
        borderRadius: 2,
        cursor: 'pointer',
        bgcolor: isActive ? (theme) => alpha(theme.palette.primary.main, 0.1) : 'transparent',
        border: isActive ? 1 : 0,
        borderColor: 'primary.main',
        transition: 'all 0.15s ease',
        '&:hover': {
          bgcolor: (theme) =>
            isActive
              ? alpha(theme.palette.primary.main, 0.15)
              : alpha(theme.palette.action.hover, 0.8),
        },
        '&:hover .action-buttons': {
          opacity: 1,
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          color: 'primary.main',
          flexShrink: 0,
        }}
      >
        <FolderIcon />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {repo.name}
          </Typography>
          {repo.isFavorite && (
            <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
          )}
          {repo.branch && (
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: 'action.hover',
                color: 'text.secondary',
                fontFamily: 'monospace',
              }}
            >
              {repo.branch.length > CONFIG.branchMaxLength
                ? `${repo.branch.slice(0, CONFIG.branchMaxLength)}...`
                : repo.branch}
            </Typography>
          )}
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {displayPath}
        </Typography>
      </Box>

      {/* Time */}
      <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
        {formatTime(repo.lastAccessed)}
      </Typography>

      {/* Action buttons */}
      <Box
        className="action-buttons"
        sx={{
          display: 'flex',
          gap: 0.5,
          opacity: 0,
          transition: 'opacity 0.15s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip title={repo.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton size="small" onClick={onFavorite}>
            {repo.isFavorite ? (
              <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
            ) : (
              <StarBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        {repo.url && (
          <Tooltip title="Open in browser">
            <IconButton
              size="small"
              component="a"
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Remove">
          <IconButton
            size="small"
            onClick={onDelete}
            sx={{ '&:hover': { color: 'error.main' } }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
