// theme-dapp.ts
import type { ThemeVars } from '@mysten/dapp-kit';

/**
 * Light theme — mirrors :root variables in globals.css
 */
export const lightTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(4px)',
  },
  backgroundColors: {
    primaryButton: 'hsl(var(--primary))',
    primaryButtonHover: 'hsl(var(--accent))',
    outlineButtonHover: 'hsl(var(--secondary))',
    walletItemHover: 'hsl(var(--muted))',
    walletItemSelected: 'hsl(var(--card))',
    modalOverlay: 'rgba(0 0 0 / 0.2)',
    modalPrimary: 'hsl(var(--card))',
    modalSecondary: 'hsl(var(--popover))',
    iconButton: 'transparent',
    iconButtonHover: 'hsl(var(--muted))',
    dropdownMenu: 'hsl(var(--card))',
    dropdownMenuSeparator: 'hsl(var(--border))',
  },
  borderColors: {
    outlineButton: 'hsl(var(--border))',
  },
  colors: {
    primaryButton: 'hsl(var(--primary-foreground))',
    outlineButton: 'hsl(var(--foreground))',
    iconButton: 'hsl(var(--foreground))',
    body: 'hsl(var(--foreground))',
    bodyMuted: 'hsl(var(--muted-foreground))',
    bodyDanger: 'hsl(var(--destructive))',
  },
  radii: {
    small: 'var(--radius-sm)',
    medium: 'var(--radius-md)',
    large: 'var(--radius-lg)',
    xlarge: 'var(--radius)',
  },
  shadows: {
    primaryButton: 'var(--shadow-glow-primary)',
    walletItemSelected: 'var(--shadow-glow-accent)',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '600',
  },
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem',
    xlarge: '1.25rem',
  },
  typography: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'normal',
    lineHeight: '1.5',
    letterSpacing: '0',
  },
};

/**
 * Dark theme — mirrors html.dark variables in globals.css
 */
export const darkTheme: ThemeVars = {
  ...lightTheme,
  backgroundColors: {
    primaryButton: 'hsl(var(--primary))',
    primaryButtonHover: 'hsl(var(--accent))',
    outlineButtonHover: 'hsl(var(--secondary))',
    walletItemHover: 'hsl(var(--muted))',
    walletItemSelected: 'hsl(var(--card))',
    modalOverlay: 'rgba(255 255 255 / 0.1)',
    modalPrimary: 'hsl(var(--card))',
    modalSecondary: 'hsl(var(--popover))',
    iconButton: 'transparent',
    iconButtonHover: 'hsl(var(--muted))',
    dropdownMenu: 'hsl(var(--card))',
    dropdownMenuSeparator: 'hsl(var(--border))',
  },
  colors: {
    primaryButton: 'hsl(var(--primary-foreground))',
    outlineButton: 'hsl(var(--foreground))',
    iconButton: 'hsl(var(--foreground))',
    body: 'hsl(var(--foreground))',
    bodyMuted: 'hsl(var(--muted-foreground))',
    bodyDanger: 'hsl(var(--destructive))',
  },
};

/**
 * Use both themes inside your WalletProvider
 *
 * Example:
 * <WalletProvider
 *   theme={[
 *     { selector: 'html:not(.dark)', variables: lightTheme },
 *     { selector: 'html.dark', variables: darkTheme },
 *   ]}
 * >
 *   <App />
 * </WalletProvider>
 */
