import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isWasher, setIsWasher] = useState(false);
  const [isRemembered, setIsRemembered] = useState(false);

  const handleLogin = () => {
    router.replace('(drawer)/index');
  };

  return (
    <ImageBackground
      source={require('../assets/images/start.avif')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Car wash</Text>
        <Text style={styles.subtitle}>Өргөн сонголт, хурдан боломж</Text>

        <View style={styles.formContainer}>
          {/* Tab сонголт */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setIsLogin(true)}
              style={[styles.tab, isLogin && styles.activeTab]}
            >
              <Text style={isLogin ? styles.activeTabText : styles.tabText}>
                Нэвтрэх
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsLogin(false)}
              style={[styles.tab, !isLogin && styles.activeTab]}
            >
              <Text style={!isLogin ? styles.activeTabText : styles.tabText}>
                Бүртгүүлэх
              </Text>
            </TouchableOpacity>
          </View>

          {/* Утасны дугаар */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Утасны дугаар"
              placeholderTextColor="#888"
              value={phone}
              onChangeText={setPhone}
              style={[styles.input, { flex: 1 }]}
              keyboardType="numeric"
            />
          </View>

          {/* Нууц үг */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Нууц үг"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Сануулах / Нууц үг мартсан */}
          {isLogin && (
            <View
              style={[
                styles.checkboxContainer,
                { justifyContent: 'space-between', alignItems: 'center' },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  value={isRemembered}
                  onValueChange={setIsRemembered}
                />
                <Text style={{ marginLeft: 8, fontSize: 12 }}>Сануулах</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  router.push('/forgot-password');
                }}
              >
                <Text style={{ color: '#007bff', fontSize: 12 }}>
                  Нууц үгээ мартсан?
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Давтах нууц үг (бүртгүүлэх үед) */}
          {!isLogin && (
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Нууц үг давтах"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Feather
                  name={showConfirmPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Угаагчаар бүртгүүлэх (бүртгүүлэх үед) */}
          {!isLogin && (
            <View style={styles.checkboxContainer}>
              <Checkbox value={isWasher} onValueChange={setIsWasher} />
              <Text style={{ marginLeft: 8, fontSize: 12 }}>
                Угаагчаар бүртгүүлэх
              </Text>
            </View>
          )}

          {/* Button */}
          <Pressable onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>
              {isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: { textAlign: 'center', color: '#aaa', marginBottom: 20 },
  formContainer: { backgroundColor: 'white', padding: 20, borderRadius: 16 },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  activeTab: { backgroundColor: '#ddd' },
  tabText: { color: '#888' },
  activeTabText: { fontWeight: 'bold', color: '#000' },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 12,
    height: 48,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
