import React, { useRef, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { useTheme } from '@/context/theme-provider';
import Typography from './Typography';
import { Stack, Row } from '../layout/Layout';
import { spacing } from '@/theme/spacing';
import { LogOut, ChevronRight } from 'lucide-react-native';

interface DrawerMenuProps {
  /**
   * Is drawer visible
   */
  visible: boolean;

  /**
   * Close drawer callback
   */
  onClose: () => void;

  /**
   * Logout callback
   */
  onLogout: () => void;

  /**
   * User name
   */
  userName?: string;

  /**
   * User email
   */
  userEmail?: string;

  /**
   * User avatar URI
   */
  userAvatar?: string;

  /**
   * Menu items to display
   */
  menuItems?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    onPress: () => void;
  }>;
}

/**
 * CustomDrawerMenu - Clean, professional right-side drawer menu
 *
 * @example
 * const [drawerVisible, setDrawerVisible] = useState(false);
 *
 * <AppHeader
 *   userName="Bayo"
 *   userAvatar={require('./avatar.png')}
 *   date="23rd, Jan 2025"
 *   title="My Study"
 *   onMenuPress={() => setDrawerVisible(true)}
 * />
 *
 * <CustomDrawerMenu
 *   visible={drawerVisible}
 *   onClose={() => setDrawerVisible(false)}
 *   onLogout={() => router.replace('/(auth)/login')}
 *   userName="Adebayo Jackson"
 *   userEmail="michaeljackson@gmail.com"
 *   userAvatar={require('./avatar.png')}
 *   menuItems={[
 *     { id: 'settings', label: 'Settings', icon: <Settings size={20} />, onPress: () => {} },
 *   ]}
 * />
 */
export const CustomDrawerMenu: React.FC<DrawerMenuProps> = ({
  visible,
  onClose,
  onLogout,
  userName = 'User',
  userEmail = 'user@example.com',
  userAvatar,
  menuItems = [],
}) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* Drawer */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '75%',
            backgroundColor: theme.colors.background,
            transform: [{ translateX: slideAnim }],
          },
        ]}>
        <View
          style={{
            flex: 1,
            paddingTop: spacing.xl,
            paddingHorizontal: spacing.lg,
          }}>
          {/* Profile Section */}
          <View
            style={{
              paddingVertical: spacing.lg,
              marginTop: spacing.xl,
              marginBottom: spacing.lg,
            }}>
            <Row gap="md" style={{ alignItems: 'center' }}>
              {/* Avatar */}
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  overflow: 'hidden',
                  backgroundColor: !userAvatar ? theme.colors.accent : theme.colors.background,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: theme.colors.primary,
                }}>
                {userAvatar ? (
                  <Image
                    source={typeof userAvatar === 'string' ? { uri: userAvatar } : userAvatar}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <Typography
                    type="h4"
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
                  style={{
                    fontFamily: 'Figtree_600SemiBold',
                  }}>
                  {userName}
                </Typography>
                <Typography
                  type="small"
                  color={theme.colors.mutedForeground}
                  style={{ marginTop: spacing.xs }}>
                  {userEmail}
                </Typography>
              </View>
            </Row>
          </View>

          {/* Menu Items */}
          <ScrollView scrollEnabled={false} style={{ flex: 1 }}>
            <Stack gap="xs">
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    item.onPress();
                    handleClose();
                  }}
                  activeOpacity={0.6}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.md,
                    borderRadius: 18,
                    backgroundColor: theme.colors.muted,
                    marginBottom: spacing.xs,
                  }}>
                  <Row gap="md" style={{ alignItems: 'center', flex: 1 }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {item.icon}
                    </View>
                    <Typography type="body" color={theme.colors.foreground} fontWeight="500">
                      {item.label}
                    </Typography>
                  </Row>
                  <ChevronRight size={18} color={theme.colors.mutedForeground} strokeWidth={2} />
                </TouchableOpacity>
              ))}
            </Stack>
          </ScrollView>
        </View>

        {/* Logout Button - Fixed at Bottom */}
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            borderStyle: 'dashed',
          }}>
          <TouchableOpacity
            onPress={onLogout}
            activeOpacity={0.6}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.md,
            }}>
            <Row gap="md" style={{ alignItems: 'center', flex: 1 }}>
              <LogOut size={20} color={theme.colors.mutedForeground} strokeWidth={2} />
              <Typography type="body" color={theme.colors.foreground} fontWeight="500">
                Logout
              </Typography>
            </Row>
            <ChevronRight size={18} color={theme.colors.mutedForeground} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};
