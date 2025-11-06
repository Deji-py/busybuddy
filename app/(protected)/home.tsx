import { useState } from 'react';
import { AppHeader } from '@/components/ui/AppHeader';
import { router } from 'expo-router';
import { Settings, HelpCircle } from 'lucide-react-native';
import { CustomDrawerMenu } from '@/components/ui/AppDrawer';
import { View } from 'react-native';
import { theme } from '@/theme';
import MyCoursesView from '@/features/myCourses/view/MyCoursesView';

export default function HomeScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleMenuPress = () => {
    setDrawerVisible(true);
  };

  const menuItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      onPress: () => router.push('/'),
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpCircle size={20} />,
      onPress: () => router.push('/'),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppHeader
        userName="Bayo"
        // userAvatar={require('@/assets/avatar.png')}
        date="23rd, Jan 2025"
        title="My Study"
        onMenuPress={handleMenuPress}
      />

      <CustomDrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onLogout={() => router.replace('/')}
        userName="Adebayo Jackson"
        userEmail="michaeljackson@gmail.com"
        // userAvatar={require('@/assets/avatar.png')}
        menuItems={menuItems}
      />

      {/* Rest of your screen content */}
      <MyCoursesView />
    </View>
  );
}
