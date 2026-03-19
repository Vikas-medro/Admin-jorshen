import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { API } from '../services/api';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const Signup = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ─── Google Auth Setup ───────────────────────────────────────────
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '616137550294-4vik65p98fb3beu9u60u9to8b54j4bm7.apps.googleusercontent.com',
    expoClientId: 'EXPO_CLIENT_ID',
    iosClientId: 'IOS_CLIENT_ID',
    webClientId: 'WEB_CLIENT_ID',
  }, {
    useProxy: true,   // ← tells Expo to use auth.expo.io as redirect URI (required for Expo Go)
  });

  // Fires whenever Google auth response changes
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSignup(authentication.accessToken);
    }
  }, [response]);

  // Sends Google token to backend → auto-registers/logs-in the user
  const handleGoogleSignup = async (token) => {
    try {
      setLoading(true);
      const res = await API.post('/google-login', {
        token,
        deviceInfo: 'Expo Mobile',
      });
      console.log('Google signup success:', res.data);
      navigation.replace('landing_page');
    } catch (error) {
      console.log('Google signup error:', error?.response?.data);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Google sign-up failed. Please try again.';
      setErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setLoading(false);
    }
  };

  // ─── Email / Password Signup ──────────────────────────────────────
  const handleSignup = async () => {
    let tempErrors = {};
    let valid = true;

    if (!fullName.trim()) {
      tempErrors.fullName = 'Full name is required';
      valid = false;
    }

    if (!mobile.trim()) {
      tempErrors.mobile = 'Mobile number is required';
      valid = false;
    } else if (mobile.length !== 10) {
      tempErrors.mobile = 'Mobile must be 10 digits';
      valid = false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Enter valid email';
      valid = false;
    }

    if (password.length < 8) {
      tempErrors.password = 'Password must be 8+ characters';
      valid = false;
    }

    setErrors(tempErrors);
    if (!valid) return;

    try {
      setLoading(true);
      const res = await API.post('/register', {
        name: fullName,
        email,
        password,
        mobile,
        deviceInfo: 'Expo Mobile',
      });
      console.log('Signup success:', res.data);
      setShowSuccess(true);
    } catch (error) {
      console.log('Signup error status:', error?.response?.status);
      console.log('Signup error data:', JSON.stringify(error?.response?.data));
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Signup failed. Please try again.';
      setErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Sign Up!</Text>
        <Text style={styles.subtitle}>Create new account</Text>

        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Your name"
        />
        {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

        <Text style={styles.label}>Mobile number</Text>
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          maxLength={10}
          placeholder="Your mobile number"
        />
        {errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholder="Email"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordBox}>
          <TextInput
            secureTextEntry={!showPassword}
            style={{ flex: 1 }}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye' : 'eye-off'} size={20} color="#999" />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        {/* GENERAL ERROR */}
        {errors.general && <Text style={styles.error}>{errors.general}</Text>}

        {/* SUBMIT BUTTON */}
        <TouchableOpacity onPress={handleSignup} disabled={loading}>
          <LinearGradient
            colors={loading ? ['#aaa', '#aaa'] : ['#6C63FF', '#7A5CFF', '#5E60F5']}
            style={styles.continueBtn}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.continueText}>Create Account</Text>}
          </LinearGradient>
        </TouchableOpacity>

        {/* GOOGLE BUTTON */}
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={() => promptAsync({ useProxy: true })}
          disabled={!request || loading}>
          <Image
            source={require('../assets/Images/google_icon.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.bottom_color}>
          <Text style={styles.footerText}>
            Don’t have an account?{'  '}
            <TouchableOpacity onPress={() => navigation.navigate('login2')}>
              <Text style={styles.register}>Sign in</Text>
            </TouchableOpacity>
          </Text>
        </View>

      </View>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <BlurView intensity={40} tint="dark" style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.line} />
            <Text style={styles.doneIcon}>✓</Text>
            <Text style={styles.doneTitle}>Account Created!</Text>
            <Text style={styles.doneText}>
              Your account has been created successfully.
            </Text>
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => {
                setShowSuccess(false);
                navigation.replace('landing_page');
              }}>
              <Text style={styles.openText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      )}
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  googleIcon: {
    width: 30,
    height: 30,
    bottom: 1,
  },

  container: {
    flex: 1,
    padding: 30,
  },

  backBtn: {
    width: 45,
    height: 45,
    backgroundColor: '#EAEAEA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111',
  },

  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 25,
    marginTop: 5,
  },

  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#333',
  },

  input: {
    backgroundColor: '#EDEDED',
    borderRadius: 14,
    padding: 15,
    fontSize: 15,
  },

  passwordBox: {
    backgroundColor: '#EDEDED',
    borderRadius: 14,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  continueBtn: {
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  googleBtn: {
    height: 60,
    backgroundColor: '#ECECEC',
    borderRadius: 30,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },



  googleText: {
    fontSize: 18,
    fontWeight: '600',
  },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
    backgroundColor: '#E8E4FF',
    paddingTop: 15,
  },

  signIn: {
    color: '#6C63FF',
    fontWeight: '600',
  },

  error: {
    color: 'red',
    marginTop: 5,
    fontSize: 13,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: '#fff',
    height: 320,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    alignItems: 'center',
  },

  line: {
    width: 60,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
  },

  doneIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  doneTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
  },

  doneText: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 30,
  },

  openBtn: {
    width: '100%',
    padding: 18,
    marginTop: 10,
    borderRadius: 30,
    backgroundColor: '#6C4CF1',
    alignItems: 'center',
  },
  bottom_color: {
    position: 'absolute',
    bottom: 0,
    width: '118%',
    paddingVertical: 20,
    paddingHorizontal: 60,
    backgroundColor: '#EFEAFF',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 40,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
    lineHeight: 30,
    padding: 6,
  },
  register: {
    color: '#6C4CF1',
    fontWeight: '600',
    bottom: -4
  },

  openText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
