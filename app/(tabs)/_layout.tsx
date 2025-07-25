import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import {  Platform } from 'react-native';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
    const { checkSubscriptionStatus } = useAuth();

    // 👇 Add polling inside useEffect
    useEffect(() => {
        const interval = setInterval(() => {
            checkSubscriptionStatus();
        }, 3600000); // every hour

        return () => clearInterval(interval);
    }, []);

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1f36',
        },
        headerTitleStyle: {
          color: '#fff',
          fontSize: 18,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: '#1a1f36',
          borderTopColor: '#2a2f45',
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#60a5fa',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarItemStyle: {
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Analyse',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="message" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sentence-correction"
        options={{
          title: 'Correction',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="checkcircleo" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="word-dictionary"
        options={{
          title: 'Dictionary',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="book" size={size} color={color} />
          ),
        }}
      />
        <Tabs.Screen
            name="settings"
            options={{
                title: 'Settings',
                tabBarIcon: ({ color, size }) => (
                <Feather name="settings" size={size} color={color} />
                ),
            }}
        />
    </Tabs>
  );
}