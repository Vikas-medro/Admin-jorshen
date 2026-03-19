import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  Modal,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import BottomTabs from "../components/bottomTabs";
import { NEWS_API } from '../services/api';

// ─── Constants ───────────────────────────────────────────────────────────────

const SUGGESTED_TAGS = [
  'AI', 'Technology', 'Safety Tool', 'Breaking', 'Trending',
  'Politics', 'Finance', 'Climate', 'Startup',
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateArticleScreen({ navigation }) {
  const [title, setTitle]               = useState('');
  const [category, setCategory]         = useState(null); // { id, name }
  const [categories, setCategories]     = useState([]);
  const [loadingCats, setLoadingCats]   = useState(true);
  const [showCatModal, setShowCatModal] = useState(false);
  const [tags, setTags]                 = useState(['Technology', 'AI', 'Safety Tool']);
  const [tagInput, setTagInput]         = useState('');
  const [location, setLocation]         = useState('');
  const [bodyText, setBodyText]         = useState('');
  const [media, setMedia]               = useState([]); // array of { uri, type }
  const [submitting, setSubmitting]     = useState(false);

  // ─── Fetch Categories on mount ───────────────────────────────────────
  useEffect(() => {
    fetchCategories();
  }, []);

const fetchCategories = async () => {
  try {
    setLoadingCats(true);

    const res = await NEWS_API.get('/categories');

    console.log('API RESPONSE 👉', res.data);

    let cats = [];

    if (Array.isArray(res.data?.data)) {
      cats = res.data.data;
    }

    // 🚨 IMPORTANT FIX: handle empty array
    if (!cats || cats.length === 0) {
      console.warn('No categories from API, using fallback');

      cats = [
        { id: 1, name: 'Technology' },
        { id: 2, name: 'Politics' },
        { id: 3, name: 'Business' },
        { id: 4, name: 'Sports' },
        { id: 5, name: 'Entertainment' },
        { id: 6, name: 'Health' },
        { id: 7, name: 'Science' },
        { id: 8, name: 'World' },
      ];
    }

    // Normalize
    const normalized = cats.map((item, index) => ({
      id: item.id || item._id || index + 1,
      name: item.name || item.title || 'Unnamed',
    }));

    setCategories(normalized);

  } catch (err) {
    console.warn('API failed, using fallback:', err.message);

    setCategories([
      { id: 1, name: 'Technology' },
      { id: 2, name: 'Politics' },
      { id: 3, name: 'Business' },
      { id: 4, name: 'Sports' },
      { id: 5, name: 'Entertainment' },
      { id: 6, name: 'Health' },
      { id: 7, name: 'Science' },
      { id: 8, name: 'World' },
    ]);

  } finally {
    setLoadingCats(false);
  }
};
  // ─── Media Picker ────────────────────────────────────────────────
  const pickMedia = async () => {
    try {
      const ImagePicker = require('expo-image-picker');

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Allow access to your media library to upload files.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const picked = result.assets.map((a) => ({
          uri: a.uri,
          type: a.type || (a.uri.endsWith('.mp4') ? 'video' : 'image'),
        }));
        setMedia((prev) => [...prev, ...picked]);
      }
    } catch {
      Alert.alert(
        'Module Not Ready',
        'expo-image-picker is not yet installed. Run:\n\nnpx expo install expo-image-picker\n\nthen reload the app.',
      );
    }
  };

  // ─── Tag helpers ─────────────────────────────────────────────────
  const addTag = (tag) => {
    const clean = tag.trim();
    if (clean && !tags.includes(clean)) setTags([...tags, clean]);
    setTagInput('');
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const removeMedia = (uri) => setMedia(media.filter((m) => m.uri !== uri));

  // ─── Submit to backend ───────────────────────────────────────────
  const submitArticle = async (status) => {
    if (!title.trim()) { Alert.alert('Missing', 'Please enter an article title.'); return; }
    if (!category)     { Alert.alert('Missing', 'Please select a category.'); return; }
    if (!bodyText.trim()) { Alert.alert('Missing', 'Please write some article content.'); return; }

    setSubmitting(true);
    try {
      const payload = {
        title:      title.trim(),
        content:    bodyText.trim(),
        categoryId: category.id,
        status,     // 'DRAFT' or 'PENDING_REVIEW'
        tagIds:     [],
      };

      const res = await NEWS_API.post('/articles', payload);
      const created = res.data?.data || res.data;

      const label     = status === 'DRAFT' ? 'draft saved' : 'submitted for editorial review';
      const statusKey = status === 'DRAFT' ? 'draft' : 'pending';

      Alert.alert('Success! 🎉', `Article ${label}.`, [
        {
          text: 'View My Articles',
          onPress: () =>
            navigation.navigate('my_articles', {
              newArticle: {
                id:     created?.id || Date.now().toString(),
                title:  title.trim(),
                status: statusKey,
                date:   new Date().toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric',
                }),
                views: 0,
              },
            }),
        },
        { text: 'OK' },
      ]);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Could not submit article.';
      Alert.alert('Error ❌', msg);
      console.error('Article submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit    = () => submitArticle('PENDING_REVIEW');
  const handleSaveDraft = () => submitArticle('DRAFT');

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Logo Strip ── */}
      <View style={styles.logoRow}>
        <View style={styles.logoIcon}>
          <Image source={require('../assets/Images/small_logo.png')}></Image>
        </View>
        <View>
          <Text style={styles.logoName}>JORSHAN</Text>
          <Text style={styles.logoSub}>MEDIA</Text>
        </View>
      </View>


      {/* ── Top Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerSide}>
          <Icon name="chevron-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Article</Text>
        <TouchableOpacity onPress={handleSaveDraft} style={styles.doneBtn} disabled={submitting}>
          <Text style={styles.doneTxt}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Article Title ── */}
        <Text style={styles.fieldLabel}>Article Title</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Enter article title..."
          placeholderTextColor="#c0c4d6"
          value={title}
          onChangeText={setTitle}
          multiline
        />

        {/* ── Category Selector ── */}
        <Text style={styles.fieldLabel}>Category</Text>
        <TouchableOpacity style={styles.categoryBox} onPress={() => setShowCatModal(true)}>
          {loadingCats ? (
            <ActivityIndicator size="small" color="#6C63FF" />
          ) : (
            <Text style={category ? styles.categorySelected : styles.categoryPlaceholder}>
              {category ? category.name : 'Select category'}
            </Text>
          )}
          <Icon name="chevron-down" size={18} color="#999" />
        </TouchableOpacity>

        {/* ── Tags ── */}
        <Text style={styles.fieldLabel}>Tags</Text>
        <View style={styles.tagsBox}>
          <View style={styles.tagsWrap}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagTxt}>{tag}</Text>
                <TouchableOpacity onPress={() => removeTag(tag)}>
                  <Icon name="close" size={13} color="#6C63FF" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TextInput
            style={styles.tagInput}
            value={tagInput}
            onChangeText={setTagInput}
            placeholder="Add a tag..."
            placeholderTextColor="#c0c4d6"
            onSubmitEditing={() => addTag(tagInput)}
            returnKeyType="done"
          />
          <View style={styles.suggestedRow}>
            {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).slice(0, 4).map((t) => (
              <TouchableOpacity key={t} style={styles.suggestChip} onPress={() => addTag(t)}>
                <Text style={styles.suggestTxt}>+ {t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Location ── */}
        <View style={styles.locationRow}>
          <Icon name="location-outline" size={18} color="#999" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.locationInput}
            placeholder="Add location..."
            placeholderTextColor="#c0c4d6"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* ── Rich-text toolbar (visual only) ── */}
        <View style={styles.editorBox}>
          <View style={styles.toolbar}>
            {['H1', 'B', 'I'].map((fmt) => (
              <TouchableOpacity key={fmt} style={styles.toolBtn}>
                <Text style={styles.toolTxt}>{fmt}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.toolDivider} />
            {['list', 'list-outline', 'reorder-three-outline'].map((ic) => (
              <TouchableOpacity key={ic} style={styles.toolBtn}>
                <Icon name={ic} size={18} color="#555" />
              </TouchableOpacity>
            ))}
            <View style={styles.toolDivider} />
            {['image-outline', 'images-outline', 'link-outline'].map((ic) => (
              <TouchableOpacity key={ic} style={styles.toolBtn} onPress={ic === 'image-outline' || ic === 'images-outline' ? pickMedia : undefined}>
                <Icon name={ic} size={18} color="#555" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Body textarea */}
          <TextInput
            style={styles.bodyInput}
            placeholder="Write your article content here..."
            placeholderTextColor="#c0c4d6"
            value={bodyText}
            onChangeText={setBodyText}
            multiline
            textAlignVertical="top"
          />

          {/* ── Media Upload Zone ── */}
          {media.length === 0 ? (
            <TouchableOpacity style={styles.uploadZone} onPress={pickMedia}>
              <View style={styles.uploadIconWrap}>
                <Icon name="image-outline" size={32} color="#b0b8d8" />
                <View style={styles.plusBadge}>
                  <Icon name="add" size={12} color="#fff" />
                </View>
              </View>
              <Text style={styles.uploadTitle}>Upload Image or Video</Text>
              <Text style={styles.uploadSub}>Tap to browse from your gallery</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.mediaGrid}>
              {media.map((m) => (
                <View key={m.uri} style={styles.mediaTile}>
                  <Image source={{ uri: m.uri }} style={styles.mediaThumb} />
                  {m.type === 'video' && (
                    <View style={styles.playOverlay}>
                      <Icon name="play-circle" size={28} color="#fff" />
                    </View>
                  )}
                  <TouchableOpacity style={styles.removeMedia} onPress={() => removeMedia(m.uri)}>
                    <Icon name="close-circle" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addMoreTile} onPress={pickMedia}>
                <Icon name="add-circle-outline" size={32} color="#6C63FF" />
                <Text style={{ fontSize: 11, color: '#6C63FF', marginTop: 4 }}>Add more</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── Bottom Action Buttons ── */}
      <View style={styles.bottomBar}>
        <View style={styles.draftPreviewRow}>
          <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
              <Text style={styles.draftTxt}>Save Draft</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.previewBtn}>
            <Text style={styles.previewTxt}>Preview</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitTxt}>Submit for Review</Text>
          )}
        </TouchableOpacity>

        {/* ── Bottom Nav ── */}
        <BottomTabs navigation={navigation} />
      </View>

      {/* ── Category Modal ── */}
      <Modal visible={showCatModal} transparent animationType="slide" onRequestClose={() => setShowCatModal(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCatModal(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Category</Text>
            {loadingCats ? (
              <ActivityIndicator size="large" color="#6C63FF" style={{ margin: 30 }} />
            ) : categories.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#999', margin: 24 }}>No categories found</Text>
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.catItem, category?.id === item.id && styles.catItemActive]}
                    onPress={() => { setCategory(item); setShowCatModal(false); }}>
                    <Text style={[styles.catItemTxt, category?.id === item.id && styles.catItemTxtActive]}>
                      {item.name}
                    </Text>
                    {category?.id === item.id && <Icon name="checkmark" size={18} color="#6C63FF" />}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  headerSide: {
    width: 36,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    letterSpacing: 0.3,
  },
  doneBtn: {
    backgroundColor: '#f0f0f5',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  doneTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  // Logo strip
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0,
    borderBottomColor: '#f0f0f5',
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#ffffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoLetter: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  logoName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111',
    letterSpacing: 1,
  },
  logoSub: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111',
    letterSpacing: 1,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },

  // Fields
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
    marginTop: 16,
  },
  titleInput: {
    fontSize: 16,
    color: '#111',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f7f8ff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#edeeff',
    minHeight: 52,
  },

  // Category
  categoryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f7f8ff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#edeeff',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  categoryPlaceholder: { fontSize: 15, color: '#c0c4d6' },
  categorySelected:    { fontSize: 15, color: '#111', fontWeight: '600' },

  // Tags
  tagsBox: {
    backgroundColor: '#f7f8ff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#edeeff',
    padding: 12,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edeeff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagTxt: { fontSize: 13, color: '#4a48c4', fontWeight: '500' },
  tagInput: {
    fontSize: 14,
    color: '#111',
    paddingVertical: 4,
    marginBottom: 8,
  },
  suggestedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestChip: {
    backgroundColor: '#ececff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  suggestTxt: { fontSize: 12, color: '#6C63FF' },

  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8ff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#edeeff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 16,
  },
  locationInput: { flex: 1, fontSize: 15, color: '#111' },

  // Editor
  editorBox: {
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: '#edeeff',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f7f8ff',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#edeeff',
    backgroundColor: '#fff',
    gap: 2,
  },
  toolBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toolTxt: { fontSize: 14, fontWeight: '700', color: '#444' },
  toolDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#dde',
    marginHorizontal: 4,
  },
  bodyInput: {
    minHeight: 100,
    paddingHorizontal: 14,
    paddingTop: 12,
    fontSize: 15,
    color: '#222',
    backgroundColor: '#f7f8ff',
  },

  // Upload zone
  uploadZone: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    marginHorizontal: 14,
    marginBottom: 14,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: '#dde2ff',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#fafbff',
  },
  uploadIconWrap: {
    position: 'relative',
    marginBottom: 10,
  },
  plusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTitle: { fontSize: 15, fontWeight: '600', color: '#555', marginBottom: 3 },
  uploadSub:   { fontSize: 12, color: '#aaa' },

  // Media grid
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
  },
  mediaTile: {
    width: 90,
    height: 90,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  mediaThumb: { width: '100%', height: '100%' },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeMedia: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  addMoreTile: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafbff',
  },

  // Bottom
  bottomBar: {
    padding: 56,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f5',
  },
  draftPreviewRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    bottom: 40,
  },
  draftBtn: {
    flex: 1,
    backgroundColor: '#f0f0f5',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftTxt: { fontSize: 15, fontWeight: '600', color: '#333' },
  previewBtn: {
    flex: 1,
    backgroundColor: '#f0f0f5',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewTxt: { fontSize: 15, fontWeight: '600', color: '#333' },
  submitBtn: {
    backgroundColor: '#3b5bfd',
    borderRadius: 30,
    height: 44,
    width: 240,
    bottom: 50,
    marginLeft: 30,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3b5bfd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // Category Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',   // sheet anchors to bottom of screen
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    maxHeight: '60%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  catItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  catItemActive:    { backgroundColor: '#f3f2ff' },
  catItemTxt:       { fontSize: 15, color: '#333' },
  catItemTxtActive: { color: '#6C63FF', fontWeight: '700' },
});