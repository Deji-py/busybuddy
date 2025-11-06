import { useTheme } from '@/context/theme-provider';
import { forwardRef, ReactNode, useRef, useState } from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
  NativeSyntheticEvent,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import Typography from './Typography';
import { Box } from '../layout/Layout';

type TabBarProps = {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
  style?: ViewStyle;
};

type TabPageProps = {
  tabs: string[];
  children: ReactNode[];
  onTabChange?: (index: number) => void;
  style?: ViewStyle;
} & TouchableOpacityProps;

export const TabBar = forwardRef<View, TabBarProps>(
  ({ tabs, activeTab, onTabChange, style }, ref) => {
    const { theme } = useTheme();

    const tabTextActive: TextStyle = {
      color: theme.colors.foreground,
    };

    const tabTextInactive: TextStyle = {
      color: theme.colors.mutedForeground,
    };

    return (
      <View ref={ref} style={[styles.tabBarContainer, style]}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={`tab-${index}`}
            style={[styles.tabButton, activeTab === index && styles.activeTabButton]}
            onPress={() => onTabChange(index)}
            activeOpacity={0.7}>
            <Typography
              style={[
                styles.tabText,
                activeTab === index ? tabTextActive : tabTextInactive,
                { fontFamily: 'Figtree_700Bold' },
              ]}>
              {tab}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
);

TabBar.displayName = 'TabBar';

export const TabPage = forwardRef<PagerView, TabPageProps>(
  ({ tabs, children, onTabChange, style, ...props }, ref) => {
    const { theme } = useTheme();
    const pagerRef = useRef<PagerView>(null);
    const [activeTab, setActiveTab] = useState(0);

    const handlePageChange = (e: NativeSyntheticEvent<{ position: number }>) => {
      const position = e.nativeEvent.position;
      setActiveTab(position);
      onTabChange?.(position);
    };

    const handleTabPress = (index: number) => {
      setActiveTab(index);
      pagerRef.current?.setPage(index);
    };

    const containerStyle: ViewStyle = {
      backgroundColor: theme.colors.background || '#f5f5f5',
    };

    const childrenArray = Array.isArray(children) ? children : [children];

    return (
      <View style={[styles.container, containerStyle, style]} {...props}>
        <Box spacingHorizontal="md">
          <TabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabPress} />
        </Box>
        <PagerView
          overScrollMode={'never'}
          scrollEnabled={false}
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={handlePageChange}>
          {childrenArray.map((child, index) => (
            <View key={`page-${index}`} style={styles.pageContainer}>
              {child}
            </View>
          ))}
        </PagerView>
      </View>
    );
  }
);

TabPage.displayName = 'TabPage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: 'hsla(0, 0%, 94%, 1.00)',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
});
