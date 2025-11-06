import React, { useRef } from 'react';
import { View, ViewStyle, Image, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '@/context/theme-provider';
import Typography from './Typography';
import { Row } from '../layout/Layout';
import { spacing } from '@/theme/spacing';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

interface AppHeaderProps {
  /**
   * User name to display
   */
  userName?: string;

  /**
   * User avatar image URI
   */
  userAvatar?: string;

  /**
   * Current date to display
   */
  date?: string;

  /**
   * Title to display in center
   */
  title?: string;

  /**
   * Show menu icon (hamburger)
   */
  showMenu?: boolean;

  /**
   * Menu press callback for custom drawer
   */
  onMenuPress?: () => void;

  /**
   * Additional container style
   */
  style?: ViewStyle;
}

/**
 * AppHeader - Reusable app header component with user info and drawer navigation
 *
 * @example
 * <AppHeader
 *   userName="Bayo"
 *   userAvatar={require('./avatar.png')}
 *   date="23rd, Jan 2025"
 *   title="My Study"
 * />
 */
export const AppHeader = React.forwardRef<View, AppHeaderProps>(
  (
    {
      userName = 'User',
      userAvatar,
      date,
      title = 'My Study',
      showMenu = true,
      onMenuPress,
      style,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    const handleMenuPress = () => {
      // Animate the menu icon
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Call custom callback or open drawer
      if (onMenuPress) {
        onMenuPress();
      } else {
        // Fallback to drawer navigation if available
        try {
          navigation.openDrawer();
        } catch (error) {
          console.log('Navigation not available');
        }
      }
    };

    const { top } = useSafeAreaInsets();

    const containerStyle: ViewStyle = {
      backgroundColor: theme.colors.muted,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      paddingTop: top + spacing.xl,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      ...style,
    };

    return (
      <View ref={ref} style={containerStyle}>
        <Row
          gap="md"
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.xl,
          }}>
          {/* User Info Section */}
          <Row gap="md" style={{ alignItems: 'center', flex: 1 }}>
            {/* Avatar */}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 30,
                overflow: 'hidden',
                backgroundColor: !userAvatar ? theme.colors.accent : theme.colors.background,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
              }}>
              {userAvatar ? (
                <Image
                  source={typeof userAvatar === 'string' ? { uri: userAvatar } : userAvatar}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <Typography
                  type="body"
                  color={!userAvatar ? theme.colors.accentForeground : theme.colors.foreground}
                  fontWeight="700">
                  {userName.charAt(0).toUpperCase()}
                </Typography>
              )}
            </View>

            {/* User Details */}
            <View style={{ flex: 1 }}>
              <Typography
                type="h5"
                color={theme.colors.foreground}
                style={{ fontFamily: 'Figtree_700Bold' }}>
                Hi, {userName}
              </Typography>
              {date && (
                <Typography
                  type="small"
                  color={theme.colors.mutedForeground}
                  style={{ marginTop: spacing.xs }}>
                  {date}
                </Typography>
              )}
            </View>
          </Row>

          {/* Menu Icon */}
          {showMenu && (
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
              }}>
              <TouchableOpacity
                onPress={handleMenuPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}>
                <Svg width="28" height="28" viewBox="0 0 24 24">
                  <Path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8h16M4 16h16"
                  />
                </Svg>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Row>

        {/* Title */}
        {title && (
          <View
            style={{
              backgroundColor: theme.colors.muted,
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
              paddingBottom: spacing.xs,
              borderRadius: 16,
            }}>
            <Typography type="h4" color={theme.colors.foreground} style={{ textAlign: 'center' }}>
              {title}
            </Typography>
          </View>
        )}
      </View>
    );
  }
);

AppHeader.displayName = 'AppHeader';
