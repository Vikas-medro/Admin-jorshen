import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import BottomTabs from '../components/bottomTabs';
import { NEWS_API } from '../services/api';

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    dotColor: '#aaa',
    bgColor: '#f0f0f0',
    textColor: '#666',
    icon: 'document-outline',
    isDraft: true,
  },
  pending: {
    label: 'Pending',
    dotColor: '#F59E0B',
    bgColor: '#FEF3C7',
    textColor: '#92400E',
    icon: null,
    isDraft: false,
  },
  approved: {
    label: 'Approved',
    dotColor: '#10B981',
    bgColor: '#D1FAE5',
    textColor: '#065F46',
    icon: null,
    isDraft: false,
  },
  rejected: {
    label: 'Rejected',
    dotColor: '#EF4444',
    bgColor: '#FEE2E2',
    textColor: '#991B1B',
    icon: null,
    isDraft: false,
  },
};

const TABS = ['Drafts', 'Pending', 'Approved', 'Rejected'];
const TAB_TO_STATUS = {
  Drafts:   'draft',
  Pending:  'pending',
  Approved: 'approved',
  Rejected: 'rejected',
};

// Map backend status enum → UI status key
const BACKEND_STATUS_MAP = {
  DRAFT:          'draft',
  PENDING_REVIEW: 'pending',
  PUBLISHED:      'approved',
  REJECTED:       'rejected',
  ARCHIVED:       'rejected',
};


// ─── Article Card ─────────────────────────────────────────────────────────────

const ArticleCard = ({ item }) => {
  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.draft;

  if (cfg.isDraft) {
    // Draft — muted style matching screenshot
    return (
      <View style={[styles.card, styles.draftCard]}>
        <View style={styles.statusRow}>
          <View style={[styles.badge, { backgroundColor: cfg.bgColor }]}>
            <Icon name={cfg.icon} size={12} color={cfg.textColor} style={{ marginRight: 4 }} />
            <Text style={[styles.badgeTxt, { color: cfg.textColor }]}>{cfg.label}</Text>
          </View>
        </View>
        <Text style={[styles.cardTitle, styles.draftTitle]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.draftDate}>{item.date}</Text>
          <View style={styles.viewsRow}>
            <Icon name="eye-outline" size={14} color="#aaa" style={{ marginRight: 4 }} />
            <Text style={styles.draftViews}>{item.views} views</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.statusRow}>
        <View style={[styles.badge, { backgroundColor: cfg.bgColor }]}>
          <View style={[styles.dot, { backgroundColor: cfg.dotColor }]} />
          <Text style={[styles.badgeTxt, { color: cfg.textColor }]}>{cfg.label}</Text>
        </View>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <View style={styles.viewsRow}>
        <Icon name="eye-outline" size={14} color="#6C63FF" style={{ marginRight: 4 }} />
        <Text style={styles.viewsTxt}>{item.views} views</Text>
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MyArticlesScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('Drafts');
  const [articles, setArticles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await NEWS_API.get('/articles');
      const raw = res.data?.data || res.data || [];

      // Map backend status → UI status key
      const mapped = raw.map((a) => ({
        id:     a.id,
        title:  a.title,
        status: BACKEND_STATUS_MAP[a.status] || 'draft',
        date:   a.publishedAt
          ? new Date(a.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          : new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        views:  a.viewCount || 0,
      }));

      // If a new article was just submitted, prepend it (optimistic update)
      const newArticle = route?.params?.newArticle;
      if (newArticle) {
        const alreadyIn = mapped.some((a) => a.id === newArticle.id);
        setArticles(alreadyIn ? mapped : [newArticle, ...mapped]);
      } else {
        setArticles(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch articles:', err);
      setError('Could not load articles. Is the backend running?');
      // Fall back to the optimistic new article if available
      const newArticle = route?.params?.newArticle;
      if (newArticle) setArticles([newArticle]);
    } finally {
      setLoading(false);
    }
  };

  const activeStatus = TAB_TO_STATUS[activeTab];
  const filtered = articles.filter((a) => a.status === activeStatus);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Logo ── */}
      <View style={styles.logoRow}>
        <Image source={require('../assets/Images/small_logo.png')} style={styles.logoImg} />
        <View>
          <Text style={styles.logoName}>JORSHAN</Text>
          <Text style={styles.logoSub}>MEDIA</Text>
        </View>
      </View>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Articles</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Tab Filter Bar ── */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabTxt, activeTab === tab && styles.tabTxtActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Article List ── */}
      {loading ? (
        <View style={styles.emptyWrap}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={[styles.emptyTxt, { marginTop: 12 }]}>Loading articles...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyWrap}>
          <Icon name="cloud-offline-outline" size={48} color="#ccc" />
          <Text style={styles.emptyTxt}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ArticleCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Icon name="document-text-outline" size={48} color="#ccc" />
              <Text style={styles.emptyTxt}>No {activeTab.toLowerCase()} articles yet</Text>
            </View>
          }
        />
      )}

      {/* ── Bottom Tabs ── */}
      <BottomTabs navigation={navigation} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  // Logo
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 6,
    backgroundColor: '#fff',
  },
  logoImg: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    marginRight: 8,
  },
  logoName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111',
    letterSpacing: 1,
  },
  logoSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 1.5,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: '#EEF0FF',
  },
  tabTxt: {
    fontSize: 13,
    fontWeight: '500',
    color: '#777',
  },
  tabTxtActive: {
    color: '#6C63FF',
    fontWeight: '700',
  },

  // List
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  draftCard: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
    lineHeight: 20,
  },
  draftTitle: {
    color: '#888',
    fontWeight: '500',
  },

  // Status row
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  badgeTxt: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },

  // Views row
  viewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  viewsTxt: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '500',
  },

  // Draft meta
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  draftDate: {
    fontSize: 12,
    color: '#aaa',
  },
  draftViews: {
    fontSize: 12,
    color: '#aaa',
  },

  // Empty
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyTxt: {
    fontSize: 15,
    color: '#bbb',
    fontWeight: '500',
  },
});
