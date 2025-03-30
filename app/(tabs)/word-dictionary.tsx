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
import { endpoints } from '@/utils/api';

const LANGUAGES = [
  { label: 'English', value: 'English' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'French', value: 'French' },
  { label: 'German', value: 'German' },
  { label: 'Japanese', value: 'Japanese' },
  { label: 'Korean', value: 'Korean' },
  { label: 'Chinese', value: 'Chinese' },
];

export default function WordDictionary() {
  const { language, setLanguage, isLoading } = useLanguage();
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [synonyms, setSynonyms] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateWord = (text: string) => {
    if (text === '') {
      return 'Please provide a word';
    }
    if (/\d/.test(text)) {
      return 'Words should not contain numbers';
    }
    if (text.length > 30) {
      return 'Word length too long. Must be less than 30 characters. If this is a sentence, please use the analyser';
    }
    if (text.includes(' ')) {
      return "This looks like a phrase. Please use the 'Analyzer'";
    }
    return null;
  };

  const lookupWord = async () => {
    const validationError = validateWord(word);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const [definitionResponse, synonymsResponse] = await Promise.all([
        fetch(
          endpoints.wordDefinition,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              word,
              nativeLanguage: language,
            }),
          }
        ),
        fetch(
          endpoints.wordSynonyms,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              word,
              nativeLanguage: language,
            }),
          }
        ),
      ]);

      const definitionData = await definitionResponse.text();
      const synonymsData = await synonymsResponse.text();

      if (!definitionResponse.ok) {
        throw new Error(definitionData);
      }
      if (!synonymsResponse.ok) {
        throw new Error(synonymsData);
      }

      const formattedDefinition = definitionData.replace(/\\n/g, '\n');
      const formattedSynonyms = synonymsData.replace(/\\n/g, '\n');

      setDefinition(formattedDefinition);
      setSynonyms(formattedSynonyms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = useCallback(async () => {
    const textToCopy = `Definition:\n${definition}\n\nSynonyms:\n${synonyms}`;
    await Clipboard.setString(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [definition, synonyms]);

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

        <Text style={styles.label}>Enter a Word</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={word}
            onChangeText={setWord}
            placeholder="Enter a word to look up"
            placeholderTextColor="#8896ab"
            maxLength={30}
          />
          {word.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setWord('')}>
              <X size={20} color="#394e6a" />
            </TouchableOpacity>
          )}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={lookupWord}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Look Up Word</Text>
          )}
        </TouchableOpacity>

        {definition || synonyms ? (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Results</Text>
              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                {copied ? (
                  <Check size={20} color="#0069ff" />
                ) : (
                  <Copy size={20} color="#394e6a" />
                )}
              </TouchableOpacity>
            </View>
            {definition ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Definition</Text>
                <Markdown style={markdownStyles}>{definition}</Markdown>
              </View>
            ) : null}

            {synonyms ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Synonyms</Text>
                <Markdown style={markdownStyles}>{synonyms}</Markdown>
              </View>
            ) : null}
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
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#394e6a',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#394e6a',
    marginBottom: 8,
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