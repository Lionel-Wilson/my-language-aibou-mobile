import { Tabs } from 'expo-router';
import { MessageSquareText, Book, CircleCheck } from 'lucide-react-native';
import { StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
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
        name="sentence-analyser"
        options={{
          title: 'Analyse',
          tabBarIcon: ({ color, size }) => (
            <MessageSquareText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sentence-correction"
        options={{
          title: 'Correction',
          tabBarIcon: ({ color, size }) => (
            <CircleCheck size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="word-dictionary"
        options={{
          title: 'Dictionary',
          tabBarIcon: ({ color, size }) => (
            <Book size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}