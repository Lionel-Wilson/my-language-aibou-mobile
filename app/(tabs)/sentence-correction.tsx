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
import {endpoints} from "@/utils/api";
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
      const response = await fetch(
        endpoints.sentenceCorrection,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sentence,
            nativeLanguage: language,
          }),
        }
      );

      const data = await response.text();
      if (!response.ok) {
        throw new Error(data);
      }

      const formattedCorrection = data.replace(/\\n/g, '\n');
      setCorrection(formattedCorrection);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = useCallback(async () => {
    await Clipboard.setString(correction);
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
        <ActivityIndicator size="large" color="#0069ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
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
            placeholderTextColor="#8896ab"
            multiline
            numberOfLines={4}
            maxLength={100}
          />
          {sentence.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSentence('')}>
              <X size={20} color="#394e6a" />
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
                  <Check size={20} color="#0069ff" />
                ) : (
                  <Copy size={20} color="#394e6a" />
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
            <View style={[styles.modalContent, { height: '70%' }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Language</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowLanguageModal(false);
                    setSearchQuery('');
                  }}
                  style={styles.closeButton}>
                  <X size={20} color="#394e6a" />
                </TouchableOpacity>
              </View>
              <View style={styles.searchContainer}>
                <Search size={20} color="#8896ab" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search languages"
                  placeholderTextColor="#8896ab"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearSearch}
                    onPress={() => setSearchQuery('')}>
                    <X size={20} color="#394e6a" />
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
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e9f4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e9f4',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#394e6a',
    marginBottom: 8,
  },
  languageSelector: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  selectedLanguage: {
    fontSize: 16,
    color: '#394e6a',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#394e6a',
  },
  clearButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  button: {
    backgroundColor: '#0069ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#dc2626',
    marginBottom: 16,
  },
  correctionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
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
    color: '#394e6a',
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#394e6a',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f3f4f6',
    margin: 16,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#394e6a',
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
    borderRadius: 8,
  },
  languageText: {
    fontSize: 16,
    color: '#394e6a',
  },
  selectedLanguageText: {
    color: '#0069ff',
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0069ff',
  },
});

const markdownStyles = {
  body: {
    color: '#394e6a',
  },
  heading1: {
    color: '#394e6a',
    fontSize: 24,
    marginBottom: 16,
  },
  heading2: {
    color: '#394e6a',
    fontSize: 20,
    marginBottom: 12,
  },
  paragraph: {
    color: '#394e6a',
    fontSize: 16,
    marginBottom: 12,
  },
};