import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';

const create_account = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* ===== TOP IMAGE SECTION ===== */}
      <View style={styles.topSection}>
        <Image source={require('../assets/Images/jorshen.png')} style={styles.image} />
      </View>

      {/* ===== MIDDLE TEXT SECTION ===== */}
      <View style={styles.middleSection}>
        <Text style={styles.title}>Jorshen — Your News. Your Way.</Text>

        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>
      </View>

      {/* ===== BOTTOM CTA SECTION ===== */}
      <View style={styles.bottomSection}>
        <TouchableOpacity onPress={() => navigation.navigate('login1')} style={styles.button}>
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Have an account?{' '}
          <Text style={styles.login} onPress={() => navigation.navigate('login2')}>
            Log in
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default create_account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Top Image */
  topSection: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 400,
    height: 405,
    top: 55,
  },

  /* Middle Text */
  middleSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#000',
    lineHeight: 32,
    fontFamily: 'PlusJakartaSans-Bold',
  },

  dotsContainer: {
    flexDirection: 'row',
    bottom: -20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DADADA',
    marginHorizontal: 6,
  },

  activeDot: {
    backgroundColor: '#6C4CF1',
    width: 10,
    height: 10,
  },

  /* Bottom CTA */
  bottomSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
  },

  button: {
    backgroundColor: '#6C4CF1',
    paddingVertical: 16,
    borderRadius: 30,
    width: '182',

    alignItems: 'center',
    marginBottom: 18,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  bottomText: {
    fontSize: 16,
    color: '#333',
  },

  login: {
    color: '#6C4CF1',
    fontWeight: '600',
  },
});
