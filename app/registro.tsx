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
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Polygon } from 'react-native-svg';
import { api } from '../services/api';

const { width, height } = Dimensions.get('window');

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const register = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!isValidEmail(trimmedUsername)) {
      Alert.alert('Error', 'Ingresa un correo válido');
      return;
    }

    if (trimmedPassword.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await api.register(trimmedUsername, trimmedPassword);
      router.push('./login');
    } catch (error: any) {
      Alert.alert('Error en registro', error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundDesign />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>REGISTRO</Text>

          <RoundedTextField
            value={username}
            onChangeText={setUsername}
            placeholder="Correo electrónico"
            keyboardType="email-address"
          />

          <RoundedTextField
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            secureTextEntry
          />

          {isLoading ? (
            <ActivityIndicator color="#FFA500" style={styles.loading} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={register}>
              <Text style={styles.buttonText}>REGISTRARSE</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => router.push('./login')}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// 🎨 Fondo con figuras pequeñas (sin animación)
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
        style={{
          position: 'absolute',
          left: x,
          top: y,
        }}
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

interface RoundedTextFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
}

const RoundedTextField: React.FC<RoundedTextFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
}) => (
  <View style={styles.textFieldContainer}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#888"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      style={styles.textField}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
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
    textAlign: 'center',
    zIndex: 1,
  },
  textFieldContainer: {
    width: '100%',
    marginVertical: 10,
    zIndex: 1,
  },
  textField: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#111',
    color: '#FFA500',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#FFA500',
    marginTop: 32,
    alignItems: 'center',
    zIndex: 1,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  loginText: {
    marginTop: 20,
    fontSize: 16,
    color: '#FFA500',
    textDecorationLine: 'underline',
    zIndex: 1,
  },
  loading: {
    marginTop: 32,
  },
});

export default RegisterScreen;
