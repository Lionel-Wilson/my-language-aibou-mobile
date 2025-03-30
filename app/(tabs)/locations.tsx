import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react-native';

const locations = [
  {
    id: 1,
    name: 'Pagasa Centre Dagenham',
    image: 'https://images.unsplash.com/photo-1601926571842-808f051b61e8?w=800',
    address: '123 Faith Street, Metro City',
    services: [
      { day: 'Sunday', time: '2:00 PM' },
    ],
    phone: '+1 (555) 123-4567',
    coordinates: { lat: 40.7128, lng: -74.0060 },
  },
  {
    id: 2,
    name: 'South Campus',
    image: 'https://images.unsplash.com/photo-1585129777188-9934d2f6c997?w=800',
    address: '456 Grace Avenue, South District',
    services: [
      { day: 'Sunday', time: '10:00 AM' },
      { day: 'Thursday', time: '6:30 PM' },
    ],
    phone: '+1 (555) 987-6543',
    coordinates: { lat: 40.7000, lng: -73.9500 },
  },
];

export default function LocationsScreen() {
  const openMaps = (lat: number, lng: number, address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  const callLocation = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Locations</Text>
        <Text style={styles.subtitle}>Join us at a campus near you</Text>
      </View>

      {locations.map((location) => (
        <View key={location.id} style={styles.locationCard}>
          <Image source={{ uri: location.image }} style={styles.locationImage} />
          
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{location.name}</Text>
            
            <View style={styles.infoRow}>
              <MapPin size={20} color="#FFFFFF" />
              <Text style={styles.infoText}>{location.address}</Text>
            </View>

            <View style={styles.servicesContainer}>
              <Clock size={20} color="#FFFFFF" />
              <View style={styles.services}>
                {location.services.map((service, index) => (
                  <Text key={index} style={styles.serviceText}>
                    {service.day}: {service.time}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.infoRow}>
              <Phone size={20} color="#FFFFFF" />
              <Text style={styles.infoText}>{location.phone}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => callLocation(location.phone)}>
                <Phone size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.directionsButton]}
                onPress={() => openMaps(
                  location.coordinates.lat,
                  location.coordinates.lng,
                  location.address
                )}>
                <Navigation size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
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
  locationCard: {
    margin: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
  },
  locationImage: {
    width: '100%',
    height: 200,
  },
  locationInfo: {
    padding: 20,
  },
  locationName: {
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
  servicesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  services: {
    flex: 1,
  },
  serviceText: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#888888',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 8,
    gap: 8,
  },
  directionsButton: {
    backgroundColor: '#2A2A2A',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});