import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome to{'\n'}Pagasa Centre</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity style={styles.eventCard}>
            <Text style={styles.eventTitle}>Sunday Service</Text>
            <Text style={styles.eventDetails}>9:00 AM | Main Sanctuary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.eventCard}>
            <Text style={styles.eventTitle}>Bible Study</Text>
            <Text style={styles.eventDetails}>Wednesday, 7:00 PM | Fellowship Hall</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.quickLinks}>
            <Link href="/media" asChild>
              <TouchableOpacity style={styles.quickLink}>
                <Text style={styles.quickLinkText}>Watch Sermons</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/connect" asChild>
              <TouchableOpacity style={styles.quickLink}>
                <Text style={styles.quickLinkText}>Contact Us</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/ministries" asChild>
              <TouchableOpacity style={styles.quickLink}>
                <Text style={styles.quickLinkText}>Join Ministry</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
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
    height: 300,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFFFFF',
  },
  eventCard: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  eventDetails: {
    color: '#888888',
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickLink: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: '#333333',
  },
  quickLinkText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});