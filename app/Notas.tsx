import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { Card, Text } from 'react-native-paper';
import Svg, { Circle, Polygon } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useNotes from '../hooks/useNotes';

const { width, height } = Dimensions.get('window');

export default function NotesListScreen() {
  const router = useRouter();
  const { notes, isLoading, error, deleteNote, loadNotes } = useNotes();

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  const handleEditNote = (noteId: number) => {
    router.push(`/create-note?id=${noteId}`);
  };

  const handleDeleteNote = async (noteId: number) => {
    Alert.alert(
      'Eliminar Nota',
      '¿Estás seguro de que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la nota');
            }
          }
        }
      ]
    );
  };

  const confirmLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión correctamente');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" color="#FFA500" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundDesign />

      {/* Botón Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <MaterialIcons name="logout" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notes.length === 0 ? (
          <Text style={styles.emptyText}>No hay notas creadas</Text>
        ) : (
          notes.map(note => (
            <Card key={note.id} style={styles.card}>
              <Card.Title
                title={note.titulo}
                titleStyle={styles.cardTitle}
              />
              <Card.Content>
                <Text
                  numberOfLines={3}
                  ellipsizeMode="tail"
                  style={styles.cardContent}
                >
                  {note.descripcion.replace(/<[^>]*>/g, '').substring(0, 200)}
                </Text>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleEditNote(note.id)}
                >
                  <MaterialIcons name="edit" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleDeleteNote(note.id)}
                >
                  <MaterialIcons name="delete" size={20} color="white" />
                </TouchableOpacity>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Botón Flotante Agregar Nota */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create-note')}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

// 🎨 Fondo con figuras geométricas pequeñas (sin animación)
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

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#FFA500',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#111',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  cardContent: {
    color: '#FFA500',
    marginTop: 8,
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  iconButton: {
    backgroundColor: '#FFA500',
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#FFA500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FFA500',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFA500',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    elevation: 4,
  },
});
