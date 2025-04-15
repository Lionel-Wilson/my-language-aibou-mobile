import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
  Clipboard,
} from 'react-native';
import { X, Search, Copy, Check } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';
import { useLanguage } from '@/hooks/useLanguage';
import {apiRequest, endpoints} from '@/utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import {LANGUAGES} from "@/utils/constants";


export default function SentenceCorrection() {
  const { language, setLanguage, isLoading } = useLanguage();
  const [sentence, setSentence] = useState('');
  const [correction, setCorrection] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const clearAll = () => {
    setSentence('');
    setCorrection('');
    setError('');
  };

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateSentence = (text: string) => {
    if (text === '') {
      return 'Please provide a sentence';
    }
    if (text.length > 100) {
      return 'The sentence must be less than 100 characters.';
    }
    return null;
  };

  const correctSentence = async () => {
    const validationError = validateSentence(sentence);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await apiRequest(endpoints.sentenceCorrection, {
        method: 'POST',
        body: JSON.stringify({
          sentence,
          nativeLanguage: language,
        }),
        requiresAuth: true,
      });

      const data = await response.text();
      if (!response.ok) {
        throw new Error(data);
      }

      const cleanedResponse = data
        .replace(/\\n/g, '\n')
        .replace(/^"/, '')
        .replace(/"$/, '');
      setCorrection(cleanedResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = useCallback(async () => {
    const cleanContent = correction
      .replace(/[#*`]/g, '')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\/g, '')
      .replace(/^"/, '')
      .replace(/"$/, '')
      .replace(/\n+/g, '\n')
      .trim();

    await Clipboard.setString(cleanContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [correction]);

  const renderLanguageItem = ({ item }: { item: typeof LANGUAGES[0] }) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => {
        setLanguage(item.value);
        setShowLanguageModal(false);
        setSearchQuery('');
      }}>
      <Text
        style={[
          styles.languageText,
          language === item.value && styles.selectedLanguageText,
        ]}>
        {item.label}
      </Text>
      {language === item.value && (
        <View style={styles.selectedIndicator} />
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#60a5fa" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1a1f36', '#2a2f45']}
        style={styles.content}>
        <Text style={styles.label}>Your Native Language</Text>
        <TouchableOpacity
          style={styles.languageSelector}
          onPress={() => setShowLanguageModal(true)}>
          <Text style={styles.selectedLanguage}>{language}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Enter a Sentence</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={sentence}
            onChangeText={setSentence}
            placeholder="Enter a sentence to correct"
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            maxLength={100}
          />
          {sentence.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAll}>
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={correctSentence}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Correct Sentence</Text>
          )}
        </TouchableOpacity>

        {correction ? (
          <View style={styles.correctionContainer}>
            <View style={styles.correctionHeader}>
              <Text style={styles.correctionTitle}>Correction</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copyToClipboard}>
                {copied ? (
                  <Check size={20} color="#60a5fa" />
                ) : (
                  <Copy size={20} color="#94a3b8" />
                )}
              </TouchableOpacity>
            </View>
            <Markdown style={markdownStyles}>{correction}</Markdown>
          </View>
        ) : null}

        <Modal
          visible={showLanguageModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setShowLanguageModal(false);
            setSearchQuery('');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <LinearGradient
                colors={['#1a1f36', '#2a2f45']}
                style={styles.modalInner}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Language</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowLanguageModal(false);
                      setSearchQuery('');
                    }}
                    style={styles.closeButton}>
                    <X size={20} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
                <View style={styles.searchContainer}>
                  <Search size={20} color="#94a3b8" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search languages"
                    placeholderTextColor="#94a3b8"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity
                      style={styles.clearSearch}
                      onPress={() => setSearchQuery('')}>
                      <X size={20} color="#94a3b8" />
                    </TouchableOpacity>
                  )}
                </View>
                <FlatList
                  data={filteredLanguages}
                  renderItem={renderLanguageItem}
                  keyExtractor={(item) => item.value}
                  style={styles.languageList}
                  keyboardShouldPersistTaps="handled"
                />
              </LinearGradient>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f36',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Add padding for tab bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1f36',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  languageSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedLanguage: {
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    paddingRight: 40,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  clearButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  button: {
    backgroundColor: '#60a5fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    marginBottom: 16,
  },
  correctionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  correctionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  correctionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  copyButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: '70%',
    backgroundColor: '#1a1f36',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalInner: {
    flex: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    padding: 4,
  },
  clearSearch: {
    padding: 4,
  },
  languageList: {
    flex: 1,
    padding: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  languageText: {
    fontSize: 16,
    color: '#fff',
  },
  selectedLanguageText: {
    color: '#60a5fa',
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#60a5fa',
  },
});

const markdownStyles = {
  body: {
    color: '#fff',
  },
  heading1: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 16,
    fontWeight: '700',
  },
  heading2: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 12,
    fontWeight: '600',
  },
  paragraph: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
  },
  list: {
    color: '#fff',
  },
  listItem: {
    color: '#fff',
  },
  link: {
    color: '#60a5fa',
  },
};