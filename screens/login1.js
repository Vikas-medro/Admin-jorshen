import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const create_account = ({ navigation }) => {

  //  Redirect URI for Expo
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  //  Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '616137550294-4vik65p98fb3beu9u60u9to8b54j4bm7.apps.googleusercontent.com',
    redirectUri,
    scopes: ['profile', 'email'],
  });

  //  Handle response
  
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Google Auth Success:', authentication);

      navigation.navigate('login2');
    }
  }, [response]);

  //  Google button function
  const signInWithGoogle = () => {
    promptAsync({ useProxy: true });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Images/jorshen_logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Jorshen Media</Text>
      <Text style={styles.subtitle}>Inspiring minds, one article at a time.</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.primaryBtn}>
        <Text style={styles.primaryText}>Continue with email</Text>
      </TouchableOpacity>

      {/* Google button */}
      <TouchableOpacity onPress={signInWithGoogle} style={styles.googleBtn}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../assets/Images/google_icon.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}> Continue with Google</Text>
        </View>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.bottom_color}>
        <Text style={styles.footerText}>
          By signing up or logging in, I accept the Inspirely{' '}
          <Text style={styles.terms}>Terms of Service</Text> and{' '}
          <Text style={styles.terms}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

export default create_account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  googleIcon: {
    width: 28,
    height: 28,
    marginRight: 10
  },

  logo: {
    width: 1100,
    height: 400,
    marginBottom: 0,
    top: -80,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111',
    top: -100,
  },

  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
    marginBottom: 40,
    textAlign: 'center',
    top: -100,
  },

  primaryBtn: {
    width: '100%',
    padding: 18,
    borderRadius: 30,
    backgroundColor: '#6C4CF1',
    alignItems: 'center',
    marginBottom: 14,
  },

  primaryText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },

  googleBtn: {
    width: '100%',
    padding: 18,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },

  googleText: {
    fontSize: 18,
    fontWeight: '500',
  },

  bottom_color: {
    position: 'absolute',
    bottom: 0,
    width: '120%',
    paddingVertical: 20,
    paddingHorizontal: 60,
    backgroundColor: '#EFEAFF',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },

  terms: {
    color: '#6C4CF1',
    fontWeight: '600',
  },
});