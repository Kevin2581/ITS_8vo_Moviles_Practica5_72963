import CustomRichEditor from '@/components/CustomRichEditor';
import useNotes from '@/hooks/useNotes';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
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
  const [showToolbar, setShowToolbar] = useState(false);

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

    const cleanedContent = content.replace(/&nbsp;/g, ' ').trim();

    if (!cleanedContent) {
      Alert.alert(
        'Contenido vacío',
        '¿Estás seguro de que quieres guardar una nota sin contenido?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Guardar',
            style: 'default',
            onPress: async () => {
              await saveOrUpdate(cleanedContent);
            },
          },
        ]
      );
      return;
    }

    await saveOrUpdate(cleanedContent);
  };

  const saveOrUpdate = async (finalContent: string) => {
    try {
      if (id) {
        await updateNote(Number(id), {
          titulo: title.trim(),
          descripcion: finalContent,
          completada: completed,
        });
      } else {
        await saveNote({
          titulo: title.trim(),
          descripcion: finalContent,
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <BackgroundDesign />

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.fab} onPress={handleSave}>
          <MaterialIcons name="save" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.titleInput}
        placeholder="Título de la nota"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
        onFocus={() => setShowToolbar(false)}
      />

      <View style={styles.editorWrapper}>
        <CustomRichEditor
          ref={richText}
          style={styles.editor}
          initialContentHTML={content}
          onChange={(html) => setContent(html.replace(/&nbsp;/g, ' '))}
          onFocus={() => setShowToolbar(true)}
          placeholder="Escribe el contenido de tu nota aquí..."
          useContainer={true}
        />
      </View>

      {showToolbar && (
        <RichToolbar
          editor={richText}
          selectedIconTint="#FFA500"
          iconTint="#FFA500"
          selectedButtonStyle={{ opacity: 0.4 }}
          style={styles.toolbar}
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
        />
      )}
    </KeyboardAvoidingView>
  );
}

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
    paddingHorizontal: 4,
    paddingTop: 40,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFA500',
    paddingHorizontal: 10,
  },
  editorWrapper: {
    flex: 1,
  },
  editor: {
    flex: 1,
    minHeight: height * 0.7,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#111',
    color: '#FFA500',
  },
  toolbar: {
    backgroundColor: '#111',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
  },
  actionsRow: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    zIndex: 10,
  },
  fab: {
    backgroundColor: '#FFA500',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
