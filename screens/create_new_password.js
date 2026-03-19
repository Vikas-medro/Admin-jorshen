import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const CreateNewPassword = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!password || !confirm) {
      setError("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    alert("Password Changed Successfully ✅");

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
        <Text style={styles.title}>Create new password</Text>
        <Text style={styles.subtitle}>
          Please note that the new password must be different from the old password.
        </Text>

        {/* New Password */}
        <Text style={styles.label}>New password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirmation</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirm}
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Icon
              name={showConfirm ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      {/* Bottom Save Button */}
      <TouchableOpacity style={styles.bottomBtn} onPress={handleSave}>
        <Text style={styles.bottomText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreateNewPassword;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },

  container: {
    flex: 1,
    padding: 25,
  },

  backBtn: {
    width: 45,
    height: 45,
    backgroundColor: "#EAEAEA",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    fontSize: 15,
    color: "#777",
    marginTop: 10,
    lineHeight: 22,
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
  },

  error: {
    color: "red",
    marginTop: 10,
  },

  bottomBtn: {
    height: 70,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  bottomText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
  },
});
