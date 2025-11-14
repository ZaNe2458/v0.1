import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { Feather } from '@expo/vector-icons';
import { loginUser, registerUser } from '../src/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE = {
  REMEMBER_ME: 'remember_me',
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USERNAME: 'username',
  RECENT_USERS: 'recent_usernames',
};

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRemembered, setIsRemembered] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [remember, token, savedUsername] = await AsyncStorage.multiGet([
          STORAGE.REMEMBER_ME,
          STORAGE.AUTH_TOKEN,
          STORAGE.USERNAME,
        ]).then((pairs) => pairs.map((p) => p[1]));
        if (remember === 'true') setIsRemembered(true);
        if (savedUsername) setUsername(savedUsername);
        if (remember === 'true' && token) {
          router.replace('/(drawer)');
        }
      } catch (e) {}
    })();
  }, []);

  const saveRecentUser = async (name) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE.RECENT_USERS);
      const list = raw ? JSON.parse(raw) : [];
      const next = [name, ...list.filter((n) => n !== name)].slice(0, 5);
      await AsyncStorage.setItem(STORAGE.RECENT_USERS, JSON.stringify(next));
    } catch (e) {
      console.log('Error saving user:', e);
    }
  };

  const clearRemembered = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE.REMEMBER_ME, STORAGE.USERNAME]);
    } catch {}
  };

  const persistSession = async (accessToken, refreshToken) => {
    if (!accessToken) return;
    const entries = [[STORAGE.AUTH_TOKEN, accessToken]];
    if (refreshToken) {
      entries.push([STORAGE.REFRESH_TOKEN, refreshToken]);
    }
    await AsyncStorage.multiSet(entries);
  };

  const handleLogin = async () => {
    if (!username || !password || (!isLogin && !confirmPassword)) {
      Alert.alert('Анхаар', 'Бүх шаардлагатай талбарыг бөглөнө үү!');
      return;
    }

    if (isLogin) {
      try {
        const data = await loginUser(username, password);
        const accessToken = data?.access ?? data?.data?.access ?? null;
        const refreshToken = data?.refresh ?? data?.data?.refresh ?? null;
        if (!accessToken) {
          Alert.alert('Алдаа', 'Нэвтрэхэд асуудал гарлаа.');
          return;
        }

        await persistSession(accessToken, refreshToken);

        if (isRemembered) {
          await AsyncStorage.multiSet([
            [STORAGE.REMEMBER_ME, 'true'],
            [STORAGE.USERNAME, username],
          ]);
        } else {
          await clearRemembered();
        }

        await saveRecentUser(username);
        router.replace('/(drawer)');
      } catch (error) {
        Alert.alert('Нэвтрэхэд алдаа гарлаа', 'Дахин оролдоно уу.');
      }
    } else {
      if (password !== confirmPassword) {
        Alert.alert('Анхаар', 'Нууц үг таарахгүй байна!');
        return;
      }

      const trimmedUsername = username.trim();
      const newUser = {
        username: trimmedUsername,
        email: `${trimmedUsername}@carwash.mn`,
        password,
        first_name: trimmedUsername,
        last_name: 'Шинэ',
        phone,
        address: 'Улаанбаатар',
      };

      try {
        const result = await registerUser(newUser);
        if (result?.status === 'success') {
          Alert.alert('Амжилттай', 'Бүртгэл үүсгэлээ!');
          setIsLogin(true);
          await saveRecentUser(username);
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
      source={require('../src/assets/images/start.avif')}
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
                  onValueChange={(v) => {
                    setIsRemembered(v);
                    if (!v) clearRemembered();
                  }}
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
