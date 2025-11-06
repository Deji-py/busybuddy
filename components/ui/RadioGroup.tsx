import React, { useMemo, useCallback } from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/theme-provider';
import Typography from './Typography';
import { spacing } from '@/theme/spacing';

type RadioGroupSize = 'sm' | 'md' | 'lg';
type RadioGroupOrientation = 'vertical' | 'horizontal';
type RadioGroupItemVariant = 'default' | 'card';

export interface RadioOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
}

interface RadioGroupComponentProps {
  /**
   * Array of radio button options
   */
  options: RadioOption[];

  /**
   * Selected option ID
   */
  selectedId?: string;

  /**
   * Callback when selection changes
   */
  onSelect: (selectedId: string) => void;

  /**
   * Label text displayed above the radio group
   */
  label?: string;

  /**
   * Helper text displayed below the radio group
   */
  helperText?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Size variant of the radio buttons
   */
  size?: RadioGroupSize;

  /**
   * Layout orientation
   */
  orientation?: RadioGroupOrientation;

  /**
   * Item variant style
   */
  itemVariant?: RadioGroupItemVariant;

  /**
   * Disable the entire group
   */
  disabled?: boolean;

  /**
   * Additional container style
   */
  style?: ViewStyle;
}

const getSizeConfig = (size: RadioGroupSize) => {
  switch (size) {
    case 'sm':
      return {
        size: 16,
        labelSize: 'small' as const,
        spacing: spacing.xs,
        radioSize: 16,
      };
    case 'lg':
      return {
        size: 24,
        labelSize: 'body' as const,
        spacing: spacing.md,
        radioSize: 24,
      };
    case 'md':
    default:
      return {
        size: 20,
        labelSize: 'body' as const,
        spacing: spacing.sm,
        radioSize: 20,
      };
  }
};

interface CustomRadioProps {
  isSelected: boolean;
  size: number;
  color: string;
}

const CustomRadio: React.FC<CustomRadioProps> = ({ isSelected, size, color }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: color,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {isSelected && (
        <View
          style={{
            width: size * 0.5,
            height: size * 0.5,
            borderRadius: (size * 0.5) / 2,
            backgroundColor: color,
          }}
        />
      )}
    </View>
  );
};

/**
 * RadioGroup - Reusable radio group component with styled card items
 *
 * @example
 * const options = [
 *   { id: '1', label: 'Option 1', value: 'option1' },
 *   { id: '2', label: 'Option 2', value: 'option2' },
 * ];
 *
 * <RadioGroupComponent
 *   options={options}
 *   selectedId={selectedId}
 *   onSelect={setSelectedId}
 *   label="Choose an option"
 *   itemVariant="card"
 * />
 */
export const RadioGroupComponent = React.forwardRef<View, RadioGroupComponentProps>(
  (
    {
      options,
      selectedId,
      onSelect,
      label,
      helperText,
      error,
      size = 'md',
      orientation = 'vertical',
      itemVariant = 'card',
      disabled = false,
      style,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const sizeConfig = getSizeConfig(size);
    const hasError = !!error;

    const handleSelect = useCallback(
      (id: string) => {
        if (!disabled) {
          onSelect(id);
        }
      },
      [disabled, onSelect]
    );

    const containerStyle: ViewStyle = useMemo(
      () => ({
        gap: spacing.xs,
        ...style,
      }),
      [style]
    );

    const radioGroupContainerStyle: ViewStyle = useMemo(
      () => ({
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
        gap: sizeConfig.spacing,
      }),
      [orientation, sizeConfig.spacing]
    );

    const renderCardItem = (option: RadioOption) => {
      const isSelected = selectedId === option.id;
      const isOptionDisabled = disabled || option.disabled;
      const radioColor = isSelected ? theme.colors.primary : theme.colors.border;

      return (
        <TouchableOpacity
          key={option.id}
          onPress={() => handleSelect(option.id)}
          disabled={isOptionDisabled}
          activeOpacity={0.7}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: isSelected ? theme.colors.primary : theme.colors.border,
              borderRadius: 18,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.md,
              gap: spacing.sm,
              backgroundColor: isSelected ? `${theme.colors.primary}05` : 'transparent',
              opacity: isOptionDisabled ? 0.6 : 1,
            }}>
            <CustomRadio isSelected={isSelected} size={sizeConfig.radioSize} color={radioColor} />
            <View style={{ flex: 1 }}>
              <Typography
                type={sizeConfig.labelSize}
                color={isOptionDisabled ? theme.colors.mutedForeground : theme.colors.foreground}
                fontWeight="500">
                {option.label}
              </Typography>
              {option.description && (
                <Typography
                  type="small"
                  color={theme.colors.mutedForeground}
                  style={{ marginTop: spacing.xs }}>
                  {option.description}
                </Typography>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    const renderDefaultItem = (option: RadioOption) => {
      const isSelected = selectedId === option.id;
      const isOptionDisabled = disabled || option.disabled;
      const radioColor = hasError
        ? theme.colors.error
        : isSelected
          ? theme.colors.primary
          : theme.colors.border;

      return (
        <TouchableOpacity
          key={option.id}
          onPress={() => handleSelect(option.id)}
          disabled={isOptionDisabled}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            paddingVertical: spacing.xs,
            opacity: isOptionDisabled ? 0.6 : 1,
          }}>
          <CustomRadio isSelected={isSelected} size={sizeConfig.radioSize} color={radioColor} />
          <Typography
            type={sizeConfig.labelSize}
            color={isOptionDisabled ? theme.colors.mutedForeground : theme.colors.foreground}
            fontWeight="500">
            {option.label}
          </Typography>
        </TouchableOpacity>
      );
    };

    return (
      <View style={containerStyle} ref={ref}>
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

        {/* Radio Group */}
        <View style={radioGroupContainerStyle}>
          {itemVariant === 'card' ? options.map(renderCardItem) : options.map(renderDefaultItem)}
        </View>

        {/* Error or Helper Text */}
        {(error || helperText) && (
          <Typography
            type="small"
            color={error ? theme.colors.error : theme.colors.mutedForeground}
            style={{ marginTop: spacing.xs }}>
            {error || helperText}
          </Typography>
        )}
      </View>
    );
  }
);

RadioGroupComponent.displayName = 'RadioGroup';
