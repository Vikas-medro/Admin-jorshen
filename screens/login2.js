import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API } from "../services/api";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const login2 = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // GOOGLE AUTH
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "EXPO_CLIENT_ID",
    androidClientId: '616137550294-4vik65p98fb3beu9u60u9to8b54j4bm7.apps.googleusercontent.com',
    iosClientId: "IOS_CLIENT_ID",
    webClientId: "WEB_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;

      handleGoogleLogin(authentication.accessToken);
    }
  }, [response]);

  const handleGoogleLogin = async (token) => {
    try {
      const res = await API.post("/google-login", {
        token,
        deviceInfo: "Expo Mobile"
      });

      // Save JWT token so news-service calls can authenticate
      const authToken = res.data?.token || res.data?.accessToken || res.data?.data?.token;
      if (authToken) {
        await AsyncStorage.setItem('authToken', authToken);
      }

      navigation.replace("landing_page");
    } catch (error) {
      console.log(error?.response?.data);
      setPasswordError(
        error?.response?.data?.message || "Google login failed"
      );
    }
  };

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleLogin = async () => {

    let valid = true;

    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Enter a valid email address');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await API.post("/login", {
        email,
        password,
        deviceInfo: "Expo Mobile"
      });

      // Save JWT token so news-service calls can authenticate
      const authToken = res.data?.token || res.data?.accessToken || res.data?.data?.token;
      if (authToken) {
        await AsyncStorage.setItem('authToken', authToken);
      }

      navigation.replace("landing_page");
    } catch (error) {
      console.log(error?.response?.data);
      setPasswordError(
        error?.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Welcome to <Image source={require('../assets/Images/small_logo.png')} style={styles.logo} />
      </Text>

      <Text style={styles.subtitle}>Sign in to your account</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Email"
        style={[styles.input, emailError && styles.errorInput]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={[styles.input, passwordError && styles.errorInput]}
        value={password}
        onChangeText={setPassword}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity
        style={styles.forgot}
        onPress={() => navigation.navigate('forgot_password')}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
        <Text style={styles.primaryText}>Login</Text>
      </TouchableOpacity>

      {/* GOOGLE LOGIN BUTTON */}
      <TouchableOpacity
        style={styles.googleBtn}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.googleText}>
          <View style={styles.google_Icon}>
            <Image source={require('../assets/Images/google_icon.png')} style={styles.googleIcon} />
          </View>
          {" "}Continue with Google
        </Text>
      </TouchableOpacity>


      {/* Footer */}
      <View style={styles.bottom_color}>
        <Text style={styles.footerText}>
          Don’t have an account?{'  '}
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.register}>Register</Text>
          </TouchableOpacity>
        </Text>
      </View>



    </SafeAreaView>
  );
};

export default login2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },

  googleIcon: {
    width: 30,
    height: 30,
    bottom: -8,
  },

  back: {
    marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    fontSize: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginTop: 30,
  },

  logo: {
    height: 25,
    width: 30,
  },

  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  errorInput: {
    borderColor: 'red',
  },

  errorText: {
    color: 'red',
    marginBottom: 12,
    fontSize: 13,
  },

  forgot: {
    color: '#6C4CF1',
    alignSelf: 'flex-end',
    marginBottom: 30,
  },

  primaryBtn: {
    backgroundColor: '#6C4CF1',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
  },

  primaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  googleBtn: {
    backgroundColor: '#F7F7F7',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },

  googleText: {
    fontSize: 18,
    fontWeight: '600',
  },

  bottom: {
    position: 'absolute',
    bottom: -535,
    width: '120%',
    padding: 24,
    backgroundColor: '#58498dff',
    left: -35,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 30,
  },

  register: {
    color: '#6C4CF1',
    fontWeight: '600',
    bottom: -4
  },
  bottom_color: {
    position: 'absolute',
    bottom: 0,
    width: '115%',
    paddingVertical: 20,
    paddingHorizontal: 60,
    backgroundColor: '#EFEAFF',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 43,
  },

  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
    lineHeight: 30,
    padding: 6,
  },

});