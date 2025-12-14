/**
 * AddItemScreen - Form for adding new clothing items
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { GlowButton } from '@/components/GlowButton';
import { FilterChip } from '@/components/FilterChip';
import { ClothingItem, ClothingCategory, Color, Season } from '@/types';
import { theme } from '@/theme';
import * as storage from '@/lib/storage';
import { analyzeClothingImage } from '@/services/imageAnalysis';
import { ImageDropZone } from '@/components/ImageDropZone';
import { extractFromUrl, downloadImageFromUrl } from '@/services/urlExtraction';

export const AddItemScreen: React.FC = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [category, setCategory] = useState<ClothingCategory | null>(null);
  const [color, setColor] = useState<Color | null>(null);
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [season, setSeason] = useState<Season>('all-season');
  const [tags, setTags] = useState<string[]>([]);
  const [cost, setCost] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [autoDetected, setAutoDetected] = useState({
    category: false,
    color: false,
    season: false,
    tags: false,
  });

  const categories: ClothingCategory[] = ['tops', 'bottoms', 'shoes', 'outerwear', 'accessories'];
  const colors: Color[] = ['black', 'white', 'gray', 'navy', 'blue', 'red', 'green', 'yellow', 'orange', 'pink', 'purple', 'brown', 'beige', 'multicolor'];
  const seasons: Season[] = ['spring', 'summer', 'fall', 'winter', 'all-season'];

  const extractFromUrlInput = async () => {
    if (!urlInput.trim()) {
      Alert.alert('Missing URL', 'Please enter a URL to extract from.');
      return;
    }

    setExtracting(true);
    try {
      const extracted = await extractFromUrl(urlInput.trim());
      
      // Auto-fill form with extracted data
      if (extracted.title) {
        // Could use title for tags or description
        if (!tags.length) {
          setTags([extracted.title]);
        }
      }
      
      if (extracted.brand) {
        setBrand(extracted.brand);
      }
      
      if (extracted.price) {
        setCost(extracted.price.toString());
      }
      
      if (extracted.size) {
        setSize(extracted.size);
      }
      
      if (extracted.category) {
        const categoryMatch = categories.find(c => 
          c.toLowerCase() === extracted.category?.toLowerCase()
        );
        if (categoryMatch) {
          setCategory(categoryMatch);
          setAutoDetected(prev => ({ ...prev, category: true }));
        }
      }
      
      if (extracted.color) {
        const colorMatch = colors.find(c => 
          c.toLowerCase() === extracted.color?.toLowerCase()
        );
        if (colorMatch) {
          setColor(colorMatch);
          setAutoDetected(prev => ({ ...prev, color: true }));
        }
      }
      
      // Download and set the first image
      if (extracted.images && extracted.images.length > 0) {
        try {
          const imageUri = await downloadImageFromUrl(extracted.images[0]);
          setImageUri(imageUri);
          // Analyze the downloaded image
          await analyzeImage(imageUri);
        } catch (error) {
          console.error('Image download error:', error);
          Alert.alert(
            'Image Download Failed', 
            'Could not download image from URL. You can add an image manually.'
          );
        }
      } else {
        Alert.alert(
          'No Images Found', 
          'Could not extract images from the URL. Please add an image manually.'
        );
      }
      
      if (extracted.metadata.extracted) {
        Alert.alert('Success', 'Content extracted from URL!');
      } else {
        Alert.alert(
          'Partial Extraction', 
          'Some information could not be extracted. Please fill in missing details manually.'
        );
      }
    } catch (error: any) {
      console.error('URL extraction error:', error);
      Alert.alert(
        'Extraction Failed', 
        error.message || 'Could not extract content from URL. This might be due to CORS restrictions. Try adding the item manually.'
      );
    } finally {
      setExtracting(false);
    }
  };

  const analyzeImage = async (uri: string) => {
    setAnalyzing(true);
    try {
      const analysis = await analyzeClothingImage(uri);
      
      // Auto-fill detected values
      if (analysis.category) {
        setCategory(analysis.category);
        setAutoDetected(prev => ({ ...prev, category: true }));
      }
      if (analysis.color) {
        setColor(analysis.color);
        setAutoDetected(prev => ({ ...prev, color: true }));
      }
      if (analysis.season) {
        setSeason(analysis.season);
        setAutoDetected(prev => ({ ...prev, season: true }));
      }
      if (analysis.brand) {
        setBrand(analysis.brand);
      }
      if (analysis.tags && analysis.tags.length > 0) {
        setTags(analysis.tags);
        setAutoDetected(prev => ({ ...prev, tags: true }));
      }
    } catch (error) {
      console.error('Image analysis error:', error);
      Alert.alert('Analysis Failed', 'Could not analyze image. Please fill in details manually.');
    } finally {
      setAnalyzing(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      // Reset auto-detected flags
      setAutoDetected({ category: false, color: false, season: false, tags: false });
      // Automatically analyze the image
      await analyzeImage(uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      // Reset auto-detected flags
      setAutoDetected({ category: false, color: false, season: false, tags: false });
      // Automatically analyze the image
      await analyzeImage(uri);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = async () => {
    if (!imageUri) {
      Alert.alert('Missing Image', 'Please add a photo of the item.');
      return;
    }
    if (!category) {
      Alert.alert('Missing Category', 'Please select a category.');
      return;
    }
    if (!color) {
      Alert.alert('Missing Color', 'Please select a color.');
      return;
    }
    if (!cost || isNaN(parseFloat(cost))) {
      Alert.alert('Invalid Cost', 'Please enter a valid cost.');
      return;
    }

    const item: ClothingItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      imageUri,
      category,
      color,
      brand: brand || undefined,
      size: size || undefined,
      season,
      tags,
      cost: parseFloat(cost),
      wearCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await storage.saveClothingItem(item);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save item. Please try again.');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Item</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* URL Input Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Or extract from URL</Text>
        <Text style={styles.hint}>
          Paste a product URL (e.g., from Amazon, Zara, etc.) to auto-fill details
        </Text>
        <View style={styles.urlInputRow}>
          <TextInput
            style={[styles.input, styles.urlInput]}
            value={urlInput}
            onChangeText={setUrlInput}
            placeholder="https://example.com/product/..."
            placeholderTextColor={theme.colors.text.tertiary}
            autoCapitalize="none"
            keyboardType="url"
            editable={!extracting}
          />
          <GlowButton
            title={extracting ? "Extracting..." : "Extract"}
            onPress={extractFromUrlInput}
            variant="secondary"
            style={styles.urlExtractButton}
            disabled={extracting || !urlInput.trim()}
          />
        </View>
        {extracting && (
          <View style={styles.extractingContainer}>
            <ActivityIndicator size="small" color={theme.colors.accent.primary} />
            <Text style={styles.extractingText}>Extracting content from URL...</Text>
          </View>
        )}
      </View>

      <View style={styles.imageSection}>
        {imageUri ? (
          <View>
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              {analyzing && (
                <View style={styles.analyzingOverlay}>
                  <ActivityIndicator size="large" color={theme.colors.accent.primary} />
                  <Text style={styles.analyzingText}>Analyzing image...</Text>
                </View>
              )}
            </View>
            <View style={styles.imageActions}>
              <GlowButton
                title="Re-analyze"
                onPress={() => analyzeImage(imageUri)}
                variant="secondary"
                style={styles.imageButton}
                disabled={analyzing}
              />
              <GlowButton
                title="Change Photo"
                onPress={pickImage}
                variant="outline"
                style={styles.imageButton}
                disabled={analyzing}
              />
            </View>
            {!analyzing && (autoDetected.category || autoDetected.color || autoDetected.season) && (
              <View style={styles.autoDetectedBadge}>
                <Text style={styles.autoDetectedText}>
                  ✓ Auto-detected: {[
                    autoDetected.category && 'Category',
                    autoDetected.color && 'Color',
                    autoDetected.season && 'Season',
                  ].filter(Boolean).join(', ')}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <ImageDropZone
            onImageSelected={async (uri) => {
              setImageUri(uri);
              setAutoDetected({ category: false, color: false, season: false, tags: false });
              await analyzeImage(uri);
            }}
            onTakePhoto={takePhoto}
            onPickImage={pickImage}
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Category *</Text>
          {autoDetected.category && (
            <Text style={styles.autoLabel}>Auto-detected</Text>
          )}
        </View>
        <View style={styles.chipRow}>
          {categories.map(cat => (
            <FilterChip
              key={cat}
              label={cat}
              active={category === cat}
              onPress={() => {
                setCategory(cat);
                setAutoDetected(prev => ({ ...prev, category: false }));
              }}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Color *</Text>
          {autoDetected.color && (
            <Text style={styles.autoLabel}>Auto-detected</Text>
          )}
        </View>
        <View style={styles.chipRow}>
          {colors.map(col => (
            <FilterChip
              key={col}
              label={col}
              active={color === col}
              onPress={() => {
                setColor(col);
                setAutoDetected(prev => ({ ...prev, color: false }));
              }}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Season</Text>
          {autoDetected.season && (
            <Text style={styles.autoLabel}>Auto-detected</Text>
          )}
        </View>
        <View style={styles.chipRow}>
          {seasons.map(sea => (
            <FilterChip
              key={sea}
              label={sea}
              active={season === sea}
              onPress={() => {
                setSeason(sea);
                setAutoDetected(prev => ({ ...prev, season: false }));
              }}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Brand</Text>
        <TextInput
          style={styles.input}
          value={brand}
          onChangeText={setBrand}
          placeholder="Enter brand name"
          placeholderTextColor={theme.colors.text.tertiary}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Size</Text>
        <TextInput
          style={styles.input}
          value={size}
          onChangeText={setSize}
          placeholder="e.g., M, 10, One Size"
          placeholderTextColor={theme.colors.text.tertiary}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Cost ($) *</Text>
        <TextInput
          style={styles.input}
          value={cost}
          onChangeText={setCost}
          placeholder="0.00"
          keyboardType="decimal-pad"
          placeholderTextColor={theme.colors.text.tertiary}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Tags</Text>
          {autoDetected.tags && tags.length > 0 && (
            <Text style={styles.autoLabel}>Auto-detected</Text>
          )}
        </View>
        <View style={styles.tagInputRow}>
          <TextInput
            style={[styles.input, styles.tagInput]}
            value={tagInput}
            onChangeText={setTagInput}
            placeholder="Add a tag"
            placeholderTextColor={theme.colors.text.tertiary}
            onSubmitEditing={addTag}
          />
          <GlowButton
            title="Add"
            onPress={addTag}
            variant="secondary"
            style={styles.tagAddButton}
          />
        </View>
        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map(tag => (
              <TouchableOpacity
                key={tag}
                style={styles.tag}
                onPress={() => removeTag(tag)}
              >
                <Text style={styles.tagText}>{tag} ×</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <GlowButton
        title="Save Item"
        onPress={handleSave}
        variant="primary"
        style={styles.saveButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  cancelText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.accent.primary,
  },
  imageSection: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.tertiary,
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
    marginBottom: theme.spacing.md,
  },
  imagePlaceholderText: {
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.md,
  },
  imageButtons: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 300,
    justifyContent: 'space-between',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.sm,
  },
  imageActions: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 300,
    justifyContent: 'space-between',
  },
  imageButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  autoDetectedBadge: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.status.success,
  },
  autoDetectedText: {
    color: theme.colors.status.success,
    fontSize: theme.typography.fontSize.xs,
    textAlign: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  autoLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.status.success,
    fontWeight: theme.typography.fontWeight.medium,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  input: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    fontSize: theme.typography.fontSize.base,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  tagAddButton: {
    paddingHorizontal: theme.spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  tag: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.accent,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  tagText: {
    color: theme.colors.accent.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  saveButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  hint: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.sm,
  },
  urlInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urlInput: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  urlExtractButton: {
    paddingHorizontal: theme.spacing.lg,
  },
  extractingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
  },
  extractingText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});

