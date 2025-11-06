import { useTheme } from '@/context/theme-provider';
import { forwardRef, ReactNode } from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import Typography from './Typography';

type ButtonProps = {
  title?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  iconSpacing?: number;
  style?: ViewStyle;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  (
    {
      title,
      variant = 'primary',
      loading = false,
      disabled,
      iconLeft,
      iconRight,
      iconSpacing = 8,
      style,
      ...touchableProps
    },
    ref
  ) => {
    const { theme } = useTheme();

    const button_variants: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: theme.colors.primary,
        borderBottomWidth: 4,
        borderColor: theme.colors.foreground,
        borderRightWidth: 1,
        borderLeftWidth: 1,
      },
      secondary: {
        backgroundColor: theme.colors.muted,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
    };

    const button_variants_text: Record<string, TextStyle> = {
      primary: {
        color: theme.colors.primaryForeground,
        fontFamily: 'Figtree_700Bold',
      },
      secondary: {
        color: theme.colors.mutedForeground,
        fontFamily: 'Figtree_700Bold',
      },
      ghost: {
        color: `${theme.colors.mutedForeground}99`,
        fontFamily: 'Figtree_700Bold',
      },
    };

    const isDisabled = disabled || loading;

    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={0.7}
        style={[
          styles.button,
          button_variants[variant],
          isDisabled && styles.disabledButton,
          style,
        ]}
        disabled={isDisabled}
        {...touchableProps}>
        {loading ? (
          <ActivityIndicator color={button_variants_text[variant].color} />
        ) : (
          <View style={styles.contentContainer}>
            {iconLeft && (
              <View style={[styles.iconContainer, { marginRight: title ? iconSpacing : 0 }]}>
                {iconLeft}
              </View>
            )}
            {title && (
              <Typography style={[styles.buttonText, button_variants_text[variant]]}>
                {title}
              </Typography>
            )}
            {iconRight && (
              <View style={[styles.iconContainer, { marginLeft: title ? iconSpacing : 0 }]}>
                {iconRight}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
});
