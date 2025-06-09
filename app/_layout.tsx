import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';
import '../index.css';
import { AuthProvider } from '@/hooks/authContext';
import { useAuth } from '@/hooks/authContext';

import { useColorScheme } from '@/components/useColorScheme';

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
    SourceSans3: require('../assets/fonts/SourceSans3-Regular.ttf'),
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

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="loginPage"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="signInPage"
          options={{
            headerShown: true,
            headerTitle: 'Sign-In',
            headerTitleStyle: { color: '#fff' },
            headerTintColor: '#2C3E50',
            headerBackground: () => <View style={{ flex: 1, backgroundColor: '#fff' }} />,
          }}
        />
        <Stack.Screen
          name="signUpPage"
          options={{
            headerShown: true,
            headerTitle: 'Sign-Up',
            headerTitleStyle: { color: '#fff' },
            headerTintColor: '#2C3E50',
            headerBackground: () => <View style={{ flex: 1, backgroundColor: '#fff' }} />,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, 
            // Hide if not logged in
            // You can use a custom prop or redirect logic in the screen itself
            // Example: pass a prop to indicate authentication status
            // Or use a redirect in the (tabs) screen if not authenticated
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
