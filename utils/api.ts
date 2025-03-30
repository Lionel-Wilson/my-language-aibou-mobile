import { EXPO_PUBLIC_API_URL } from '@env';

export const API_URL = EXPO_PUBLIC_API_URL;

export const endpoints = {
    sentenceAnalysis: `${API_URL}/api/v1/sentence/explanation`,
    sentenceCorrection: `${API_URL}/api/v1/sentence/correction`,
    wordDefinition: `${API_URL}/api/v1/word/definition`,
    wordSynonyms: `${API_URL}/api/v1/word/synonyms`,
};