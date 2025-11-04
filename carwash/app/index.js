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
import { loginUser, registerUser } from '../data/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isWasher, setIsWasher] = useState(false);
  const [isRemembered, setIsRemembered] = useState(false);

  const handleLogin = async () => {
    if (!username || !password || (!isLogin && !confirmPassword)) {
      Alert.alert('Анхаар', 'Бүх шаардлагатай талбарыг бөглөнө үү!');
      return;
    }
    if (isLogin) {
      try {
        const data = await loginUser(username, password);
        if (data.data.access) {
          router.replace('/(drawer)');
        } else {
          Alert.alert('Алдаа', 'Нэвтрэхэд асуудал гарлаа.');
        }
      } catch (error) {
        Alert.alert('Нэвтрэхэд алдаа гарлаа', 'Дахин оролдоно уу.');
      }
    } else {
      if (password !== confirmPassword) {
        Alert.alert('Анхаар', 'Нууц үг таарахгүй байна!');
        return;
      }

      const newUser = {
        username: username,
        email: `${username}@carwash.mn`,
        password: password,
        first_name: 'Хэрэглэгч',
        last_name: 'Шинэ',
        phone: phone,
        address: 'Улаанбаатар',
      };

      try {
        const result = await registerUser(newUser);
        if (result.status === 'success') {
          Alert.alert('Амжилттай', 'Бүртгэл үүсгэлээ!');
          setIsLogin(true);
        } else {
          Alert.alert('Алдаа', 'Бүртгэл амжилтгүй боллоо.');
        }
      } catch (error) {
        Alert.alert('Алдаа', 'Бүртгэл үүсгэхэд алдаа гарлаа.');
      }
    }
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

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Хэрэглэгчийн нэр"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
              style={[styles.input, { flex: 1 }]}
              autoCapitalize="none"
            />
          </View>

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

          {!isLogin && (
            <View style={styles.checkboxContainer}>
              <Checkbox value={isWasher} onValueChange={setIsWasher} />
              <Text style={{ marginLeft: 8, fontSize: 12 }}>
                Угаагчаар бүртгүүлэх
              </Text>
            </View>
          )}

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
