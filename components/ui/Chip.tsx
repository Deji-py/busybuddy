import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ChipProps {
  label: string;
  onPress?: () => void;
  onClose?: () => void;
  selected?: boolean;
  disabled?: boolean;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  showClose?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  backgroundColor?: string;
  borderColor?: string;
}

const Chip: React.FC<ChipProps> = ({
  label,
  onPress,
  onClose,
  selected = false,
  disabled = false,
  variant = 'filled',
  size = 'medium',
  color = '#007AFF',
  showClose = false,
  style,
  textStyle,
  backgroundColor,
  borderColor,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const sizeStyles = {
    small: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: 12,
      height: 24,
    },
    medium: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 14,
      height: 32,
    },
    large: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 16,
      height: 40,
    },
  };

  const currentSize = sizeStyles[size];

  let chipBackgroundColor = backgroundColor;
  let chipBorderColor = borderColor || color;
  let chipTextColor = '#000';

  if (variant === 'filled') {
    chipBackgroundColor = backgroundColor || (selected ? color : '#E8E8E8');
    chipTextColor = selected ? '#FFF' : '#333';
  } else if (variant === 'outlined') {
    chipBackgroundColor = backgroundColor || '#FFF';
    chipBorderColor = borderColor || color;
    chipTextColor = color;
  }

  if (disabled) {
    chipBackgroundColor = '#D3D3D3';
    chipTextColor = '#999';
    chipBorderColor = '#BBB';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      activeOpacity={0.7}>
      <View
        style={[
          styles.chip,
          {
            backgroundColor: chipBackgroundColor,
            borderColor: chipBorderColor,
            borderWidth: variant === 'outlined' ? 1 : 0,
            opacity: isPressed ? 0.8 : 1,
            paddingHorizontal: currentSize.paddingHorizontal,
            paddingVertical: currentSize.paddingVertical,
            height: currentSize.height,
          },
          style,
        ]}>
        <Text
          style={[
            styles.text,
            {
              fontSize: currentSize.fontSize,
              color: chipTextColor,
            },
            textStyle,
          ]}
          numberOfLines={1}>
          {label}
        </Text>
        {showClose && onClose && (
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
            <Text
              style={[
                styles.closeText,
                {
                  color: chipTextColor,
                  fontSize: currentSize.fontSize - 2,
                },
              ]}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
    marginRight: 4,
  },
  closeButton: {
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontWeight: 'bold',
  },
});

export default Chip;
