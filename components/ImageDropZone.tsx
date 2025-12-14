/**
 * ImageDropZone - Drag and drop image upload for web, fallback to buttons for mobile
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { GlowButton } from './GlowButton';
import { theme } from '@/theme';

interface ImageDropZoneProps {
  onImageSelected: (uri: string) => void;
  onTakePhoto: () => void;
  onPickImage: () => void;
}

export const ImageDropZone: React.FC<ImageDropZoneProps> = ({
  onImageSelected,
  onTakePhoto,
  onPickImage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Only set dragging to false if we're leaving the window
      if (e.target === document.body || !e.relatedTarget) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    };

    const handleFileInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleFile(target.files[0]);
        // Reset input so same file can be selected again
        target.value = '';
      }
    };

    if (typeof window !== 'undefined') {
      // Prevent default drag behavior on window
      window.addEventListener('dragover', handleDragOver);
      window.addEventListener('dragleave', handleDragLeave);
      window.addEventListener('drop', handleDrop);

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      input.addEventListener('change', handleFileInput);
      fileInputRef.current = input;
      document.body.appendChild(input);

      return () => {
        window.removeEventListener('dragover', handleDragOver);
        window.removeEventListener('dragleave', handleDragLeave);
        window.removeEventListener('drop', handleDrop);
        if (fileInputRef.current && document.body.contains(fileInputRef.current)) {
          document.body.removeChild(fileInputRef.current);
        }
      };
    }
  }, [handleFile]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        onImageSelected(result);
      }
    };
    reader.onerror = () => {
      alert('Failed to read image file');
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleClick = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      onPickImage();
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.dropZone,
          isDragging && styles.dropZoneActive,
        ]}
        // @ts-ignore - web-specific props
        onDragOver={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          const files = e.dataTransfer?.files;
          if (files && files.length > 0) {
            handleFile(files[0]);
          }
        }}
      >
        <Text style={styles.dropZoneIcon}>📷</Text>
        <Text style={styles.dropZoneText}>
          {isDragging ? 'Drop image here' : 'Drag & drop image here'}
        </Text>
        <Text style={styles.dropZoneSubtext}>or</Text>
        <View style={styles.dropZoneButtons}>
          <GlowButton
            title="Choose File"
            onPress={handleClick}
            variant="outline"
            style={styles.dropZoneButton}
          />
        </View>
      </View>
    );
  }

  // Mobile fallback
  return (
    <View style={styles.mobileContainer}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderIcon}>📷</Text>
        <Text style={styles.imagePlaceholderText}>No photo</Text>
      </View>
      <View style={styles.imageButtons}>
        <GlowButton
          title="📸 Take Photo"
          onPress={onTakePhoto}
          variant="primary"
          style={[styles.imageButton, { marginRight: theme.spacing.sm }]}
        />
        <GlowButton
          title="🖼️ Choose from Library"
          onPress={onPickImage}
          variant="primary"
          style={styles.imageButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropZone: {
    width: 300,
    minHeight: 200,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border.secondary,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  dropZoneActive: {
    borderColor: theme.colors.accent.primary,
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderStyle: 'solid',
  },
  dropZoneIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  dropZoneText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  dropZoneSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.md,
  },
  dropZoneButtons: {
    width: '100%',
  },
  dropZoneButton: {
    width: '100%',
  },
  mobileContainer: {
    width: '100%',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 2,
    borderColor: theme.colors.border.secondary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  imagePlaceholderText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  imageButtons: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 350,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
  },
  imageButton: {
    flex: 1,
    minWidth: 140,
    minHeight: 44,
  },
});

