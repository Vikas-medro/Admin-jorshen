import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";

const BottomTabs = ({ navigation }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate("landing_page")}>
        <Icon name="home-outline" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity>
        <Icon name="bookmark-outline" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity>
        <Icon name="search-outline" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("notifications")}>
        <Icon name="notifications-outline" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity>
        <Icon name="settings-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({

  bottomNav: {
    position: 'absolute',
    bottom: 25,
    left: 55,
    right: 55,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});