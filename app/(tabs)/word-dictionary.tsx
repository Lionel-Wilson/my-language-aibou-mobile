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
  Dimensions,
} from 'react-native';
import { X, Search, Copy, Check, ChevronDown } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';
import { useLanguage } from '@/hooks/useLanguage';
import { endpoints } from '@/utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import {LANGUAGES} from "@/utils/constants";

const { height } = Dimensions.get('window');

const SECTION_HEIGHT = Math.min(height * 0.5, 400);

export default function WordDictionary() {
  const { language, setLanguage, isLoading } = useLanguage();
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [synonyms, setSynonyms] = useState('');
  const [history, setHistory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const [collapsedSections, setCollapsedSections] = useState({
    definition: false,
    synonyms: false,
    history: false,
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearAll = () => {
    setWord('');
    setDefinition('');
    setSynonyms('');
    setHistory('');
    setError('');
  };

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
      const [definitionResponse, synonymsResponse, historyResponse] = await Promise.all([
        fetch(endpoints.wordDefinition, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            word,
            nativeLanguage: language,
          }),
        }),
        fetch(endpoints.wordSynonyms, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            word,
            nativeLanguage: language,
          }),
        }),
        fetch(endpoints.wordHistory, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            word,
            nativeLanguage: language,
          }),
        }),
      ]);

      const definitionData = await definitionResponse.text();
      const synonymsData = await synonymsResponse.text();
      const historyData = await historyResponse.text();

      if (!definitionResponse.ok) {
        throw new Error(definitionData);
      }
      if (!synonymsResponse.ok) {
        throw new Error(synonymsData);
      }
      if (!historyResponse.ok) {
        throw new Error(historyData);
      }

      const cleanDefinition = definitionData
        .replace(/\\n/g, '\n')
        .replace(/^"/, '')
        .replace(/"$/, '');
      const cleanSynonyms = synonymsData
        .replace(/\\n/g, '\n')
        .replace(/^"/, '')
        .replace(/"$/, '');
      const cleanHistory = historyData
        .replace(/\\n/g, '\n')
        .replace(/^"/, '')
        .replace(/"$/, '');

      setDefinition(cleanDefinition);
      setSynonyms(cleanSynonyms);
      setHistory(cleanHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = useCallback(async (section: string, content: string) => {
    const cleanContent = content
      .replace(/[#*`]/g, '')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\/g, '')
      .replace(/^"/, '')
      .replace(/"$/, '')
      .replace(/\n+/g, '\n')
      .trim();

    await Clipboard.setString(cleanContent);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  }, []);

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

        <Text style={styles.label}>Enter a Word</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={word}
            onChangeText={setWord}
            placeholder="Enter a word to look up"
            placeholderTextColor="#94a3b8"
            maxLength={30}
          />
          {word.length > 0 && (
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
          onPress={lookupWord}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Look Up Word</Text>
          )}
        </TouchableOpacity>

        {(definition || synonyms || history) ? (
          <View style={styles.resultsContainer}>
            {definition ? (
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection('definition')}>
                  <Text style={styles.sectionTitle}>Definition</Text>
                  <View style={styles.sectionHeaderRight}>
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={() => copyToClipboard('definition', definition)}>
                      {copiedSection === 'definition' ? (
                        <Check size={20} color="#60a5fa" />
                      ) : (
                        <Copy size={20} color="#94a3b8" />
                      )}
                    </TouchableOpacity>
                    <ChevronDown
                      size={20}
                      color="#94a3b8"
                      style={[
                        styles.chevron,
                        collapsedSections.definition && styles.chevronCollapsed,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
                {!collapsedSections.definition && (
                  <View style={styles.sectionContentWrapper}>
                    <ScrollView
                      style={[
                        styles.sectionContent,
                        { maxHeight: SECTION_HEIGHT },
                      ]}
                      contentContainerStyle={styles.sectionContentContainer}
                      showsVerticalScrollIndicator={true}>
                      <Markdown style={markdownStyles}>{definition}</Markdown>
                    </ScrollView>
                    <View style={styles.scrollIndicator}>
                      <ChevronDown size={16} color="#94a3b8" />
                    </View>
                  </View>
                )}
              </View>
            ) : null}

            {synonyms ? (
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection('synonyms')}>
                  <Text style={styles.sectionTitle}>Synonyms</Text>
                  <View style={styles.sectionHeaderRight}>
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={() => copyToClipboard('synonyms', synonyms)}>
                      {copiedSection === 'synonyms' ? (
                        <Check size={20} color="#60a5fa" />
                      ) : (
                        <Copy size={20} color="#94a3b8" />
                      )}
                    </TouchableOpacity>
                    <ChevronDown
                      size={20}
                      color="#94a3b8"
                      style={[
                        styles.chevron,
                        collapsedSections.synonyms && styles.chevronCollapsed,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
                {!collapsedSections.synonyms && (
                  <View style={styles.sectionContentWrapper}>
                    <ScrollView
                      style={[
                        styles.sectionContent,
                        { maxHeight: SECTION_HEIGHT },
                      ]}
                      contentContainerStyle={styles.sectionContentContainer}
                      showsVerticalScrollIndicator={true}>
                      <Markdown style={markdownStyles}>{synonyms}</Markdown>
                    </ScrollView>
                    <View style={styles.scrollIndicator}>
                      <ChevronDown size={16} color="#94a3b8" />
                    </View>
                  </View>
                )}
              </View>
            ) : null}

            {history ? (
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection('history')}>
                  <Text style={styles.sectionTitle}>Word History</Text>
                  <View style={styles.sectionHeaderRight}>
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={() => copyToClipboard('history', history)}>
                      {copiedSection === 'history' ? (
                        <Check size={20} color="#60a5fa" />
                      ) : (
                        <Copy size={20} color="#94a3b8" />
                      )}
                    </TouchableOpacity>
                    <ChevronDown
                      size={20}
                      color="#94a3b8"
                      style={[
                        styles.chevron,
                        collapsedSections.history && styles.chevronCollapsed,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
                {!collapsedSections.history && (
                  <View style={styles.sectionContentWrapper}>
                    <ScrollView
                      style={[
                        styles.sectionContent,
                      ]}
                      contentContainerStyle={styles.sectionContentContainer}
                      showsVerticalScrollIndicator={true}>
                      <Markdown style={markdownStyles}>{history}</Markdown>
                    </ScrollView>
                    <View style={styles.scrollIndicator}>
                      <ChevronDown size={16} color="#94a3b8" />
                    </View>
                  </View>
                )}
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
  resultsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  sectionContentWrapper: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  sectionContent: {
    padding: 16,
  },
  sectionContentContainer: {
    paddingBottom: 32,
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: 'rgba(26, 31, 54, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronCollapsed: {
    transform: [{ rotate: '-180deg' }],
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