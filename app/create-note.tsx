import CustomRichEditor from '@/components/CustomRichEditor';
import useNotes from '@/hooks/useNotes';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import Svg, { Circle, Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function CreateNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const richText = useRef<CustomRichEditor>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [completed, setCompleted] = useState(false);

  const { notes, saveNote, updateNote } = useNotes();

  useEffect(() => {
    if (id) {
      const noteId = Number(id);
      const noteToEdit = notes.find(note => note.id === noteId);
      if (noteToEdit) {
        setTitle(noteToEdit.titulo);
        setContent(noteToEdit.descripcion);
        setCompleted(noteToEdit.completada);
        richText.current?.setContentHTML(noteToEdit.descripcion);
      }
    }
  }, [id, notes]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Por favor ingresa un título para la nota');
      return;
    }

    try {
      if (id) {
        await updateNote(Number(id), {
          titulo: title,
          descripcion: content,
          completada: completed,
        });
      } else {
        await saveNote({
          titulo: title.trim(),
          descripcion: content,
          completada: completed,
        });
      }
      router.back();
    } catch (error) {
      alert('Error al guardar la nota');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundDesign />
      <ScrollView style={styles.container} nestedScrollEnabled={false}>
        <TextInput
          style={styles.titleInput}
          placeholder="Título de la nota"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        <CustomRichEditor
          ref={richText}
          style={styles.editor}
          initialContentHTML={content}
          onChange={setContent}
          placeholder="Escribe el contenido de tu nota aquí..."
          useContainer={true}
        />

        <RichToolbar
          editor={richText}
          selectedIconTint="#FFA500"
          iconTint="#FFA500"
          scalesPageToFit={Platform.OS === 'android'}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.setStrikethrough,
            actions.blockquote,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.undo,
            actions.redo,
          ]}
          style={styles.toolbar}
        />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleSave}>
        <MaterialIcons name="save" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 4,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#FFA500',
    paddingHorizontal: 10,
  },
  editor: {
    flex: 1,
    minHeight: 300,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#FFA500',
    backgroundColor: '#111',
  },
  toolbar: {
    backgroundColor: '#111',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
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
});
