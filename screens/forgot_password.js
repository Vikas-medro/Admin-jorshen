import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const forgot_password = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

 const handleReset = () => {
  if (!email) {
    setError("Please enter email");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    setError("Enter valid email");
    return;
  }

  setError("");

  // Navigate to Create New Password screen
  navigation.navigate("create_new_password");
};


  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Please enter the email registered with the application to receive a password reset email.
        </Text>

        {/* Email */}
        <Text style={styles.label}>Registered email</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

      </View>

      {/* Bottom Button */}
      <TouchableOpacity style={styles.bottomBtn} onPress={handleReset}>
        <Text style={styles.bottomText}>Send password reset link</Text>
      </TouchableOpacity>

        <TouchableOpacity style={styles.create_new} onPress={() => navigation.navigate('create_new_password')}>

      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default forgot_password;


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  container: {
    padding: 25,
    flex: 1,
  },

  backBtn: {
    width: 45,
    height: 45,
    backgroundColor: '#EAEAEA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111'
  },

  subtitle: {
    fontSize: 15,
    color: '#777',
    marginTop: 10,
    lineHeight: 22,
    marginBottom: 30
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333'
  },

  input: {
    backgroundColor: '#EDEDED',
    borderRadius: 14,
    padding: 15,
    fontSize: 15
  },

  error: {
    color: 'red',
    marginTop: 8
  },

  bottomBtn: {
    height: 70,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  bottomText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
   

  }
});
