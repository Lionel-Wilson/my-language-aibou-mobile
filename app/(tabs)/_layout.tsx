import { Tabs } from 'expo-router';
import { MessageSquareText, Book, CircleCheck } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0069ff',
        },
        headerTitleStyle: {
          color: '#fff',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e5e7eb',
        },
        tabBarActiveTintColor: '#0069ff',
        tabBarInactiveTintColor: '#394e6a',
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