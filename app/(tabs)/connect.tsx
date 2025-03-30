import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  ChevronRight,
  Bell,
  Users,
  Calendar,
} from 'lucide-react-native';

const contactCards = [
  {
    id: 1,
    title: 'Prayer Request',
    description: 'Submit your prayer requests to our prayer team',
    icon: MessageSquare,
    color: '#333333',
  },
  {
    id: 2,
    title: 'Join Small Group',
    description: 'Connect with others in a small group setting',
    icon: Users,
    color: '#2A2A2A',
  },
  {
    id: 3,
    title: 'Schedule Meeting',
    description: 'Book an appointment with our pastoral team',
    icon: Calendar,
    color: '#333333',
  },
  {
    id: 4,
    title: 'Newsletter Signup',
    description: 'Stay updated with church news and events',
    icon: Bell,
    color: '#2A2A2A',
  },
];

export default function ConnectScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Handle form submission
    console.log({ name, email, message });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connect With Us</Text>
        <Text style={styles.subtitle}>We'd love to hear from you</Text>
      </View>

      <View style={styles.quickActions}>
        {contactCards.map((card) => (
          <TouchableOpacity key={card.id} style={styles.actionCard}>
            <View style={[styles.iconContainer, { backgroundColor: card.color }]}>
              <card.icon size={24} color="#FFFFFF" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{card.title}</Text>
              <Text style={styles.actionDescription}>{card.description}</Text>
            </View>
            <ChevronRight size={20} color="#888888" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contactInfo}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoRow}>
          <Phone size={20} color="#FFFFFF" />
          <Text style={styles.infoText}>+1 (555) 123-4567</Text>
        </View>
        <View style={styles.infoRow}>
          <Mail size={20} color="#FFFFFF" />
          <Text style={styles.infoText}>contact@pagasacentre.org</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Send us a Message</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#666666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Your email"
            placeholderTextColor="#666666"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={message}
            onChangeText={setMessage}
            placeholder="Your message"
            placeholderTextColor="#666666"
            multiline
            numberOfLines={Platform.OS === 'ios' ? null : 4}
            minHeight={Platform.OS === 'ios' ? 100 : null}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Send size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  quickActions: {
    padding: 20,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333333',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#FFFFFF',
  },
  actionDescription: {
    fontSize: 14,
    color: '#888888',
  },
  contactInfo: {
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#888888',
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#333333',
  },
  messageInput: {
    height: Platform.OS === 'ios' ? 100 : null,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    gap: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});