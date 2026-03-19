import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import BottomTabs from "../components/bottomTabs";
import { NEWS_API } from "../services/api";

const STATUS_COLORS = {
  approved: "#4CAF50",
  pending:  "#FF9800",
  rejected: "#F44336",
};

// Map backend status → UI key
const BACKEND_STATUS_MAP = {
  DRAFT:          'draft',
  PENDING_REVIEW: 'pending',
  PUBLISHED:      'approved',
  REJECTED:       'rejected',
  ARCHIVED:       'rejected',
};

export default function DashboardScreen({ navigation }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await NEWS_API.get('/articles');
      const raw = res.data?.data || res.data || [];

      // Compute stats
      const stats = raw.reduce(
        (acc, a) => {
          acc.total++;
          const key = BACKEND_STATUS_MAP[a.status] || 'draft';
          if (key === 'approved') acc.approved++;
          else if (key === 'pending') acc.pending++;
          else if (key === 'rejected') acc.rejected++;
          return acc;
        },
        { total: 0, approved: 0, pending: 0, rejected: 0 }
      );

      // Format recent articles (latest 5)
      const articles = raw.slice(0, 5).map((a) => ({
        id:       a.id,
        title:    a.title,
        category: a.category?.name || 'General',
        status:   BACKEND_STATUS_MAP[a.status] || 'draft',
      }));

      setData({ user: 'Reporter', stats, articles });
    } catch (err) {
      console.warn('Dashboard fetch failed, using empty state:', err.message);
      setData({
        user: 'Reporter',
        stats: { total: 0, approved: 0, pending: 0, rejected: 0 },
        articles: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Logo Strip ── */}
      <View style={styles.logoRow}>
        <View style={styles.logoIcon}>
          <Image source={require('../assets/Images/small_logo.png')} />
        </View>
        <View>
          <Text style={styles.logoName}>JORSHAN</Text>
          <Text style={styles.logoSub}>MEDIA</Text>
        </View>
      </View>

      {/* Loading state — inline, hooks count never changes */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={{ marginTop: 12, color: '#777' }}>Loading dashboard...</Text>
        </View>
      ) : (
        <>
          {/* Header */}
          <Text style={styles.greeting}>Good morning, {data?.user} 👋</Text>
          <Text style={styles.subText}>Here's a quick overview of your newsroom activity</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <StatCard title="Total Articles" value={data?.stats?.total ?? 0} />
            <StatCard title="Approved"       value={data?.stats?.approved ?? 0} />
            <StatCard title="Pending"        value={data?.stats?.pending ?? 0} />
            <StatCard title="Rejected"       value={data?.stats?.rejected ?? 0} />
          </View>

          {/* Create Button */}
          <TouchableOpacity onPress={() => navigation.navigate('create_article')} style={styles.button}>
            <Text style={styles.buttonText}>Create Article</Text>
            <Text style={styles.buttonSub}>Submit news for editorial review</Text>
          </TouchableOpacity>

          {/* Recent */}
          <Text style={styles.sectionTitle}>Recent Submissions</Text>
          <FlatList
            data={data?.articles ?? []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ArticleItem item={item} />}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
                No articles yet. Create your first one!
              </Text>
            }
          />
        </>
      )}

      <BottomTabs navigation={navigation} />
    </SafeAreaView>
  );
}

/* 🔹 Stat Card */
const StatCard = ({ title, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

/* 🔹 Article Item */
const ArticleItem = ({ item }) => (
  <View style={styles.articleCard}>
    <Text style={styles.articleTitle}>{item.title}</Text>

    <View style={styles.row}>
      <Text style={styles.category}>{item.category}</Text>

      <View
        style={[
          styles.badge,
          { backgroundColor: STATUS_COLORS[item.status] },
        ]}
      >
        <Text style={styles.badgeText}>{item.status}</Text>
      </View>
    </View>
  </View>


);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },

  greeting: {
    paddingTop: 15,
    fontSize: 22,

    fontWeight: "600",
  },

  subText: {
    color: "#777",
    marginBottom: 20,
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },


  // Logo strip
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: -18,
    borderBottomWidth: 0,
    borderBottomColor: '#f0f0f5',
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
  
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

  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  statTitle: {
    color: "#777",
  },

  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },

  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  buttonSub: {
    color: "#ccc",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  articleCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  articleTitle: {
    fontWeight: "500",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  category: {
    color: "#888",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    textTransform: "capitalize",
  },
});