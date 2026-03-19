import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from "@expo/vector-icons/Ionicons";
import BottomTabs from '../components/bottomTabs';

const notifications = [
  {
    id: '1',
    title: 'the one and only modi ji',
    subtitle: '1 Opportunities in United States',
  },
  {
    id: '2',
    title: 'the one and only modi ji',
    subtitle: '1 Opportunities in United States',
  },
  {
    id: '3',
    title: 'the one and only modi ji',
    subtitle: '1 Opportunities in United States',
  },
  {
    id: '4',
    title: 'the one and only modi ji',
    subtitle: '1 Opportunities in United States',
  },
];

const NotificationScreen = ({navigation}) => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Icon name="school-outline" size={22} color="#555" />
        </View>

        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.menuBtn}>
        <Icon name="ellipsis-horizontal" size={18} color="#555" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notification</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Bottom Tab */}
      <View style={styles.tabBar}>
         <BottomTabs navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
  },

  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },

  menuBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});