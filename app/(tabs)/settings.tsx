import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest, endpoints } from '@/utils/api';
import * as WebBrowser from 'expo-web-browser';

export default function Settings() {
  const { user, logout, updateEmail, deleteAccount } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateEmail = async () => {
    try {
      setError(null);
      await updateEmail(newEmail);
      setIsEditingEmail(false);
      setNewEmail(newEmail);
      Alert.alert('Success', 'Email updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update email');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  const handleCancelSubscription = async () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await apiRequest(endpoints.cancelSubscription, {
                method: 'POST',
                requiresAuth: true,
              });
              Alert.alert('Success', 'Subscription cancelled successfully');
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };


  const handleSubscribe = async () => {
    if (user?.status === 'active' || user?.status === 'trialing') {
      Alert.alert(
          'Already Subscribed',
          'You already have an active subscription or are in a trial period.'
      );
      return;
    }

    try {
      setLoading(true);
      const response = await apiRequest(endpoints.checkoutSession, {
        method: 'POST',
        requiresAuth: true,
      });
      const data = await response.json();

      await WebBrowser.openBrowserAsync(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          {isEditingEmail ? (
            <View style={styles.emailEditContainer}>
              <TextInput
                style={styles.emailInput}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder={user?.email}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <View style={styles.emailEditButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setIsEditingEmail(false);
                    setNewEmail('');
                  }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdateEmail}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditingEmail(true)}>
              <Text style={styles.value}>{user?.email}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Subscription Status</Text>
          <Text style={styles.value}>{user?.status}</Text>
        </View>

        {user?.status === 'trialing' && (
          <View style={styles.row}>
            <Text style={styles.label}>Trial Ends</Text>
            <Text style={styles.value}>
              {user?.trialEnd ? new Date(user.trialEnd).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {user?.status === 'trialing' && (
          <TouchableOpacity
            style={[styles.button, styles.subscribeButton]}
            onPress={handleSubscribe}
            disabled={loading}>
            <Text style={styles.buttonText}>Subscribe Now</Text>
          </TouchableOpacity>
        )}

        {user?.status === 'active' && (
          <TouchableOpacity
            style={[styles.button, styles.cancelSubscriptionButton]}
            onPress={handleCancelSubscription}
            disabled={loading}>
            <Text style={styles.cancelSubscriptionText}>Cancel Subscription</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={logout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e9f4',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#394e6a',
    marginBottom: 16,
  },
  row: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#394e6a',
  },
  emailEditContainer: {
    marginTop: 8,
  },
  emailInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#394e6a',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emailEditButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButton: {
    backgroundColor: '#0069ff',
  },
  logoutButton: {
    backgroundColor: '#f8fafc',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  cancelSubscriptionButton: {
    backgroundColor: '#f8fafc',
  },
  cancelButton: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveButton: {
    backgroundColor: '#0069ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButtonText: {
    color: '#394e6a',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelSubscriptionText: {
    color: '#394e6a',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#394e6a',
    fontSize: 14,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  error: {
    color: '#dc2626',
    marginTop: 16,
    textAlign: 'center',
  },
});