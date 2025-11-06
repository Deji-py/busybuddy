import { View, StyleSheet, TextInput as RNTextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/theme-provider';
import { forwardRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

type TextInputProp = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  isPassword?: boolean;
};

const Input = forwardRef<RNTextInput, TextInputProp>(
  ({ placeholder, value, onChangeText, isPassword = false }, ref) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const containerStyles = [
      styles.container,
      {
        backgroundColor: theme.colors.background,
        borderColor: isFocused ? theme.colors.secondary : theme.colors.border,
      },
      isFocused && { borderWidth: 1 },
    ];

    const textInputStyles = [
      styles.textinput,
      {
        color: theme.colors.foreground,
      },
    ];

    return (
      <View style={containerStyles}>
        <RNTextInput
          ref={ref}
          style={[textInputStyles, isPassword && { paddingRight: 40 }]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.mutedForeground}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}>
            {isPasswordVisible ? (
              <Ionicons name="eye-outline" size={20} color={theme.colors.mutedForeground} />
            ) : (
              <Ionicons name="eye-off-outline" size={20} color={theme.colors.mutedForeground} />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  textinput: {
    height: '100%',
    flex: 1,
    borderRadius: 12,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 6,
    padding: 8,
  },
});

export default Input;
