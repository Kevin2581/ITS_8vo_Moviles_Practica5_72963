import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Polygon } from 'react-native-svg';
import { api } from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña');
      return;
    }
    setIsLoading(true);
    try {
      const token = await api.login(email, password);
      if (token) {
        router.push('/Notas');
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (error: any) {
      Alert.alert('Error', error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundDesign />

      <View style={styles.card}>
        <Text style={styles.title}>INICIAR SESIÓN</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { flex: 1, marginTop: 0, borderWidth: 0 }]}
            placeholder="Contraseña"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#FFA500"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('./registro')}>
          <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Fondo futurista
const BackgroundDesign = () => {
  const elements = [];
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const isCircle = i % 2 === 0;
    elements.push(
      <Svg
        key={i}
        height={8}
        width={8}
        style={{ position: 'absolute', left: x, top: y }}
        pointerEvents="none"
      >
        {isCircle ? (
          <Circle cx={4} cy={4} r={2} fill="#1f1f1f" />
        ) : (
          <Polygon points="4,0 8,8 0,8" fill="#2a2a2a" />
        )}
      </Svg>
    );
  }
  return <>{elements}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#111',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFA500',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: '#000',
    color: '#FFA500',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  passwordWrapper: {
    width: '100%',
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFA500',
    borderRadius: 10,
    backgroundColor: '#000',
    paddingHorizontal: 4,
  },
  eyeButton: {
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#FFA500',
    marginTop: 32,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  registerText: {
    marginTop: 20,
    color: '#FFA500',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Login;
