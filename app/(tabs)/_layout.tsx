import React from 'react';
import { FontAwesome, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { Home, BookOpenCheck, FileText, UserRound } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          position: 'absolute',
          margin: 16,
          borderRadius: 24, // Adjust for more/less roundness
          backgroundColor: '#fff', // Or use your theme color
          height: 60, // Optional: adjust height
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 8,
          elevation: 5, // For Android shadow
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        // Optionally, reduce label font size or adjust padding:
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <Feather name='home' color={color} size={28} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Aralin',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 name='book-reader' color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Pagsusulit',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name='quiz' color={color} size={28}/>,
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 name='user' color={color} size={28}/>,
        }}
      />
    </Tabs>
  );
}
