import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LanguageCode, LANGUAGES } from '../constants/languages';

export const AuthScreen = () => {
  const { signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [targetLanguage, setTargetLanguage] = useState(LanguageCode.EN);
  const [userLanguage, setUserLanguage] = useState(LanguageCode.RU);

  const handleSubmit = async () => {
    try {
      let response;
      if (isLogin) {
        response = await api.login(email, password);
      } else {
        response = await api.register(email, password, username, targetLanguage, userLanguage);
      }
      
      await signIn(response.access_token);
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert(
        'Error',
        'Authentication failed. Please check your credentials.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Select Target Language:</Text>
                <Picker
                  selectedValue={targetLanguage}
                  onValueChange={(itemValue) => setTargetLanguage(itemValue)}
                  style={styles.picker}>
                  {(Object.keys(LANGUAGES) as LanguageCode[]).map((lang) => (
                    <Picker.Item
                      key={lang}
                      label={LANGUAGES[lang]}
                      value={lang}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Select Your Language:</Text>
                <Picker
                  selectedValue={userLanguage}
                  onValueChange={(itemValue) => setUserLanguage(itemValue)}
                  style={styles.picker}>
                  {(Object.keys(LANGUAGES) as LanguageCode[]).map((lang) => (
                    <Picker.Item
                      key={lang}
                      label={LANGUAGES[lang]}
                      value={lang}
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {isLogin ? 'Login' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton} 
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchText}>
              {isLogin 
                ? "Don't have an account? Register" 
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  switchText: {
    color: '#007AFF',
    fontSize: 14,
  },
}); 