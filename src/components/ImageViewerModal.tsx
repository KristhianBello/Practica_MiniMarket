import { ImageSource, Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ImageViewerModalProps = {
  visible: boolean;
  image: ImageSource;
  title?: string;
  onClose: () => void;
};

export function ImageViewerModal({ visible, image, title, onClose }: ImageViewerModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar imagen" />

        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          {title ? (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            <View style={styles.titleSpacer} />
          )}
          <Pressable style={styles.closeButton} onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} contentFit="contain" />
        </View>

        <Text style={[styles.hint, { paddingBottom: insets.bottom + 16 }]}>
          Toca fuera de la imagen para cerrar
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 1,
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  titleSpacer: {
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hint: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    paddingTop: 8,
    zIndex: 1,
  },
});
