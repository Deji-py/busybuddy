// ================================================================
// FileUploader.tsx
// ================================================================

import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@/context/theme-provider';
import { File, X, UploadCloud } from 'lucide-react-native';
import Typography from './Typography';
import { Stack, Row } from '../layout/Layout';
import { spacing } from '@/theme/spacing';

type FileUploaderVariant = 'default' | 'compact';

interface FileUploaderProps {
  /**
   * Label text displayed above the uploader
   */
  label?: string;

  /**
   * Placeholder text inside the upload area
   */
  placeholder?: string;

  /**
   * Helper text below the uploader
   */
  helperText?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Callback when upload area is pressed
   */
  onPress?: () => void;

  /**
   * Currently selected file name
   */
  fileName?: string;

  /**
   * Callback to remove selected file
   */
  onRemove?: () => void;

  /**
   * Height of the upload area
   */
  height?: number;

  /**
   * Disable the uploader
   */
  disabled?: boolean;

  /**
   * Show icon in upload area
   */
  showIcon?: boolean;

  /**
   * Variant of the uploader
   */
  variant?: FileUploaderVariant;

  /**
   * Custom style
   */
  style?: ViewStyle;
}

/**
 * FileUploader - Reusable file upload component with dashed border
 *
 * @example
 * <FileUploader
 *   label="Upload Document"
 *   placeholder="Upload Drivers License"
 *   helperText="Please upload a clear image less than 5mb"
 
 *   fileName="license.jpg"
 
 * />
 */
export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  placeholder = 'Upload Material',
  helperText = 'image or pdf of your less tha 5mb in size',
  error,
  onPress,
  fileName,
  onRemove,
  height = 180,
  disabled = false,
  showIcon = true,
  variant = 'default',
  style,
}) => {
  const { theme } = useTheme();
  const hasError = !!error;
  const hasFile = !!fileName;

  return (
    <Stack gap="xs" style={style}>
      {/* Label */}
      {label && (
        <Typography
          type="body"
          color={theme.colors.foreground}
          fontWeight="500"
          style={{ marginBottom: spacing.xs }}>
          {label}
        </Typography>
      )}

      {/* Upload Area */}
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        style={[
          styles.uploadArea,
          {
            height: variant === 'compact' ? 120 : height,
            borderColor: hasError
              ? theme.colors.error
              : hasFile
                ? theme.colors.primary
                : theme.colors.border,
            borderWidth: 2,
            borderRadius: theme.radius.lg,
            backgroundColor: disabled
              ? theme.colors.muted
              : hasFile
                ? `${theme.colors.primary}08`
                : 'transparent',
            opacity: disabled ? 0.6 : 1,
          },
        ]}>
        {hasFile ? (
          // File Selected State
          <Row gap="md" alignItems="center" justifyContent="space-between" flex={1}>
            <Row gap="md" alignItems="center" flex={1}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: theme.radius.md,
                  backgroundColor: `${theme.colors.primary}15`,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <File size={24} color={theme.colors.primary} />
              </View>
              <Stack gap="xs" flex={1}>
                <Typography
                  type="body"
                  color={theme.colors.foreground}
                  fontWeight="500"
                  numberOfLines={1}>
                  {fileName}
                </Typography>
                <Typography type="small" color={theme.colors.mutedForeground}>
                  Tap to change
                </Typography>
              </Stack>
            </Row>
            {onRemove && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                style={{
                  padding: spacing.xs,
                }}>
                <X size={20} color={theme.colors.mutedForeground} />
              </Pressable>
            )}
          </Row>
        ) : (
          // Empty State
          <Stack gap="md" alignItems="center" justifyContent="center">
            {showIcon && (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: `${theme.colors.primary}15`,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <UploadCloud size={28} color={theme.colors.primary} />
              </View>
            )}
            <Stack gap="xs" alignItems="center">
              <Typography
                type="body"
                color={theme.colors.foreground}
                fontWeight="500"
                style={{ textAlign: 'center' }}>
                {placeholder}
              </Typography>
              {helperText && (
                <Typography
                  type="small"
                  color={theme.colors.mutedForeground}
                  style={{ textAlign: 'center' }}>
                  {helperText}
                </Typography>
              )}

              <Typography
                type="small"
                color={theme.colors.secondary}
                style={{ textAlign: 'center' }}>
                for better quality upload a pdf
              </Typography>
            </Stack>
          </Stack>
        )}
      </Pressable>

      {/* Error Message */}
      {error && (
        <Typography type="small" color={theme.colors.error} style={{ marginTop: spacing.xs }}>
          {error}
        </Typography>
      )}
    </Stack>
  );
};

const styles = StyleSheet.create({
  uploadArea: {
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
  },
});
