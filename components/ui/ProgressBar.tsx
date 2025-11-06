import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@/context/theme-provider';
import Typography from './Typography';
import { spacing } from '@/theme/spacing';

type ProgressBarSize = 'sm' | 'md' | 'lg';
type ProgressBarVariant = 'default' | 'success' | 'warning' | 'danger';

interface ProgressBarProps {
  /**
   * Progress value between 0 and 1
   */
  progress: number;

  /**
   * Size variant of the progress bar
   */
  size?: ProgressBarSize;

  /**
   * Visual variant of the progress bar
   */
  variant?: ProgressBarVariant;

  /**
   * Label text displayed above the progress bar
   */
  label?: string;

  /**
   * Show percentage text
   */
  showPercentage?: boolean;

  /**
   * Helper text displayed below the progress bar
   */
  helperText?: string;

  /**
   * Whether to animate progress changes
   */
  animated?: boolean;

  /**
   * Custom width of the progress bar
   */
  width?: number;

  /**
   * Border radius of the progress bar
   */
  borderRadius?: number;

  /**
   * Show indeterminate loading state
   */
  indeterminate?: boolean;

  /**
   * Additional container style
   */
  style?: ViewStyle;
}

const getSizeConfig = (size: ProgressBarSize) => {
  switch (size) {
    case 'sm':
      return {
        height: 4,
        labelSize: 'small' as const,
      };
    case 'lg':
      return {
        height: 12,
        labelSize: 'body' as const,
      };
    case 'md':
    default:
      return {
        height: 8,
        labelSize: 'body' as const,
      };
  }
};

const getVariantColors = (variant: ProgressBarVariant, theme: any) => {
  switch (variant) {
    case 'success':
      return {
        filled: theme.colors.success || '#10b981',
        unfilled: `${theme.colors.success || '#10b981'}20`,
      };
    case 'warning':
      return {
        filled: theme.colors.warning || '#f59e0b',
        unfilled: `${theme.colors.warning || '#f59e0b'}20`,
      };
    case 'danger':
      return {
        filled: theme.colors.error || '#ef4444',
        unfilled: `${theme.colors.error || '#ef4444'}20`,
      };
    case 'default':
    default:
      return {
        filled: theme.colors.secondary,
        unfilled: `${theme.colors.primary}20`,
      };
  }
};

/**
 * ProgressBar - Reusable progress bar component
 *
 * @example
 * <ProgressBar
 *   progress={0.65}
 *   label="Installation Progress"
 *   showPercentage
 *   variant="success"
 *   size="md"
 * />
 */
export const ProgressBar = React.forwardRef<View, ProgressBarProps>(
  (
    {
      progress,
      size = 'md',
      variant = 'default',
      label,
      showPercentage = false,
      helperText,
      animated = true,
      width,
      borderRadius = 8,
      indeterminate = false,
      style,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const sizeConfig = getSizeConfig(size);
    const colors = getVariantColors(variant, theme);

    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const percentage = Math.round(clampedProgress * 100);

    const containerStyle: ViewStyle = useMemo(
      () => ({
        gap: spacing.xs,
        ...style,
      }),
      [style]
    );

    const labelContainerStyle: ViewStyle = useMemo(
      () => ({
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }),
      []
    );

    const progressBarContainerStyle: ViewStyle = useMemo(
      () => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
      }),
      []
    );

    return (
      <View style={containerStyle} ref={ref}>
        {/* Label and Percentage */}
        {(label || showPercentage) && (
          <View style={labelContainerStyle}>
            {label && (
              <Typography
                type={sizeConfig.labelSize}
                color={theme.colors.foreground}
                fontWeight="500">
                {label}
              </Typography>
            )}
            {showPercentage && (
              <Typography
                type={sizeConfig.labelSize}
                color={theme.colors.mutedForeground}
                fontWeight="600">
                {percentage}%
              </Typography>
            )}
          </View>
        )}

        {/* Progress Bar */}
        <View style={progressBarContainerStyle}>
          <Progress.Bar
            ref={ref}
            style={{ flex: 1 }}
            progress={clampedProgress}
            width={null}
            height={sizeConfig.height}
            borderRadius={borderRadius}
            color={colors.filled}
            unfilledColor={colors.unfilled}
            borderWidth={0}
            animated={animated}
            indeterminate={indeterminate}
            animationType="timing"
            useNativeDriver={false}
          />
        </View>

        {/* Helper Text */}
        {helperText && (
          <Typography
            type="small"
            color={theme.colors.mutedForeground}
            style={{ marginTop: spacing.xs }}>
            {helperText}
          </Typography>
        )}
      </View>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
