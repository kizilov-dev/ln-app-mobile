import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Tooltip from 'rn-tooltip';
import { Audio } from 'expo-av';
import { useAuth } from '../context/AuthContext';

// Моковые данные для фраз
const MOCK_PHRASES = [
  {
    id: '1',
    text: 'I enjoy spending time with my family and friends',
    translation: 'Я люблю проводить время с семьей и друзьями',
    audio: 'https://example.com/audio1.mp3', // Здесь должны быть реальные URL аудио
  },
  {
    id: '2',
    text: 'My favorite hobby is reading books',
    translation: 'Мое любимое хобби - чтение книг',
    audio: 'https://example.com/audio2.mp3', // Здесь должны быть реальные URL аудио
  },
  {
    id: '3',
    text: 'I like to travel and explore new places',
    translation: 'Я люблю путешествовать и исследовать новые места',
    audio: 'https://example.com/audio3.mp3', // Здесь должны быть реальные URL аудио
  },
  {
    id: '4',
    text: 'Music helps me relax after a long day',
    translation: 'Музыка помогает мне расслабиться после долгого дня',
    audio: 'https://example.com/audio4.mp3', // Здесь должны быть реальные URL аудио
  },
  {
    id: '5',
    text: 'I try to exercise regularly to stay healthy',
    translation: 'Я стараюсь регулярно заниматься спортом, чтобы оставаться здоровым',
    audio: 'https://example.com/audio5.mp3', // Здесь должны быть реальные URL аудио
  },
];

// Добавим информацию о задании
const SPEAKING_TASK = {
  topic: "Daily Routine and Hobbies",
  description: "Tell us about your typical day and what you like to do in your free time",
  duration: 60, // длительность в секундах
  minWords: 50,
};

export const MainScreen = () => {
  const { signOut } = useAuth();
  const [hasRecording, setHasRecording] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playPhrase = async (phraseId: string) => {
    // Если уже играет какой-то звук, останавливаем его
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setPlayingPhraseId(null);
    }

    if (playingPhraseId === phraseId) {
      // Если нажали на ту же фразу, просто останавливаем
      return;
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: MOCK_PHRASES.find(p => p.id === phraseId)?.audio || '' },
        { shouldPlay: true }
      );
      setSound(newSound);
      setPlayingPhraseId(phraseId);

      // Когда воспроизведение закончится
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingPhraseId(null);
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleRecordPress = () => {
    // TODO: Implement recording functionality
    console.log('Start recording');
    setHasRecording(true); // Временно для демонстрации
  };

  const handlePlayPress = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement play/pause functionality
  };

  const handleDeletePress = () => {
    setHasRecording(false);
    // TODO: Implement delete functionality
  };

  const handleSavePress = () => {
    // TODO: Implement save functionality
    console.log('Save recording');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Speaking Task</Text>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.taskContainer}>
        <Text style={styles.taskTopic}>{SPEAKING_TASK.topic}</Text>
        <Text style={styles.taskDescription}>{SPEAKING_TASK.description}</Text>
        <View style={styles.taskRequirements}>
          <View style={styles.requirementItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.requirementText}>
              Duration: {formatTime(SPEAKING_TASK.duration)}
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons name="text-outline" size={20} color="#666" />
            <Text style={styles.requirementText}>
              Min words: {SPEAKING_TASK.minWords}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recommended Phrases</Text>

      <View style={styles.scrollContainer}>
        <ScrollView 
          style={styles.phrasesList} 
          contentContainerStyle={styles.phrasesContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.phrasesFlow}>
            {MOCK_PHRASES.map((phrase, index) => (
              <View key={phrase.id} style={styles.phraseContainer}>
                <Tooltip
                  popover={<Text style={styles.tooltipText}>{phrase.translation}</Text>}
                  actionType='press'
                  width={200}
                  height={40}
                  backgroundColor="#333"
                  withPointer={true}
                >
                  <Text style={styles.phraseText}>
                    {phrase.text}
                    {index < MOCK_PHRASES.length - 1 ? ' ' : ''}
                  </Text>
                </Tooltip>
                <TouchableOpacity
                  style={styles.playPhraseButton}
                  onPress={() => playPhrase(phrase.id)}
                >
                  <Ionicons
                    name={playingPhraseId === phrase.id ? "pause" : "play"}
                    size={16}
                    color="#007AFF"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {hasRecording && (
        <View style={styles.recordingContainer}>
          <View style={styles.recordingContent}>
            <TouchableOpacity 
              style={styles.playButton} 
              onPress={handlePlayPress}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={24} 
                color="#007AFF" 
              />
            </TouchableOpacity>
            <View style={styles.recordingInfo}>
              <Text style={styles.recordingTitle}>Your Recording</Text>
              <Text style={styles.recordingDuration}>0:30</Text>
            </View>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDeletePress}
            >
              <Ionicons name="trash-outline" size={24} color="#ff4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.controlsContainer}>
        <View style={styles.recordButtonContainer}>
          <TouchableOpacity
            style={styles.recordButton}
            onPress={handleRecordPress}
          >
            <View style={styles.recordButtonInner} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSavePress}
        >
          <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    maxHeight: '30%',
  },
  phrasesList: {
    flex: 1,
  },
  phrasesContent: {
    padding: 16,
  },
  phrasesFlow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  phraseText: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  recordButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff4444',
  },
  recordingContainer: {
    position: 'absolute',
    bottom: 140,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  recordingDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phraseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  playPhraseButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  taskContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  taskTopic: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  taskRequirements: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    position: 'absolute',
    right: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 