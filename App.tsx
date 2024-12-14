import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthScreen } from './src/screens/AuthScreen';
import { MainScreen } from './src/screens/MainScreen';
import { RootStackParamList } from './src/navigation/types';
import { useEffect, useState } from 'react';
import { tokenStorage } from './src/utils/tokenStorage';
import { api } from './src/services/api';
import { useAuth, AuthProvider } from './src/context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  const { isAuthenticated, signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await tokenStorage.get();
      if (token) {
        await api.getProfile(token);
        await signIn(token);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await tokenStorage.remove();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
