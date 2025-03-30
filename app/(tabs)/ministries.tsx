import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Users, Music, Heart, BookOpen } from 'lucide-react-native';

const ministries = [
  {
    id: 1,
    name: 'Worship Ministry',
    description: 'Join our worship team to lead the congregation in praise and worship.',
    icon: Music,
    requirements: ['Musical ability', 'Heart for worship', 'Commitment to rehearsals'],
  },
  {
    id: 2,
    name: 'Children\'s Ministry',
    description: 'Help nurture the faith of our youngest members through engaging activities and Bible lessons.',
    icon: Heart,
    requirements: ['Love for children', 'Patient and caring', 'Background check required'],
  },
  {
    id: 3,
    name: 'Bible Study Leaders',
    description: 'Lead small groups in studying God\'s word and fostering spiritual growth.',
    icon: BookOpen,
    requirements: ['Strong biblical knowledge', 'Leadership skills', 'Regular attendance'],
  },
];

export default function MinistriesScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Ministries</Text>
        <Text style={styles.subtitle}>Find your place to serve and grow</Text>
      </View>

      <View style={styles.ministriesList}>
        {ministries.map((ministry) => (
          <TouchableOpacity key={ministry.id} style={styles.ministryCard}>
            <View style={styles.ministryHeader}>
              <ministry.icon size={24} color="#FFFFFF" />
              <Text style={styles.ministryName}>{ministry.name}</Text>
            </View>
            <Text style={styles.ministryDescription}>{ministry.description}</Text>
            <View style={styles.requirements}>
              <Text style={styles.requirementsTitle}>Requirements:</Text>
              {ministry.requirements.map((req, index) => (
                <Text key={index} style={styles.requirementItem}>• {req}</Text>
              ))}
            </View>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
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
  ministriesList: {
    padding: 20,
  },
  ministryCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  ministryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ministryName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#FFFFFF',
  },
  ministryDescription: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 15,
  },
  requirements: {
    marginBottom: 15,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  requirementItem: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 10,
    marginBottom: 3,
  },
  applyButton: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});