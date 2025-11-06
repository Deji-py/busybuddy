import ThemeProvider from '@/context/theme-provider';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  useFonts,
  Figtree_600SemiBold,
  Figtree_500Medium,
  Figtree_700Bold,
} from '@expo-google-fonts/dev';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import toastConfig from '@/lib/config/toastConfig';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';

// import { KeyboardProvider } from 'react-native-keyboard-controller';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

// New Query Client
const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <>
      {/* <AuthProvider> */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <KeyboardProvider preload={false}>
              <ThemeProvider theme="light">
                <Stack
                  initialRouteName="(auth)"
                  screenOptions={{
                    headerShown: false,
                  }}>
                  <Stack.Screen name="(auth)" />
                </Stack>

                <Toast
                  topOffset={-40}
                  swipeable={false}
                  visibilityTime={1000}
                  config={toastConfig}
                />
              </ThemeProvider>
            </KeyboardProvider>
            <StatusBar style="auto" />
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
      {/* </AuthProvider> */}
    </>
  );
}
