import { type ReactNode } from 'react';
import { useTheme } from 'twenty-ui/theme-constants';

type GraphControlButtonProps = {
  ariaLabel: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

// A plain button rather than twenty-ui's IconButton, which adds ~550KB to every front component bundle
export const GraphControlButton = ({
  ariaLabel,
  disabled = false,
  onClick,
  children,
}: GraphControlButtonProps) => {
  const theme = useTheme();

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        padding: 0,
        border: `1px solid ${theme.border.color.medium}`,
        borderRadius: theme.border.radius.sm,
        background: theme.background.primary,
        color: theme.font.color.secondary,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
};
