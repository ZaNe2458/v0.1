import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  Image,
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
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Car wash</Text>
      <Text style={styles.subtitle}>zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz</Text>

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

        <TextInput
          placeholder="Утасны дугаар"
          placeholderTextColor="#888"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="numeric"
        />

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
              <Checkbox value={isRemembered} onValueChange={setIsRemembered} />
              <Text style={{ marginLeft: 8, fontSize: 12 }}>Сануулах</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                // Нууц үг мартсан дээр дарахад хийх үйлдэл
                router.push('/forgot-password'); // Жишээ маршрут
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

        {isLogin && (
          <>
            <View style={styles.separatorContainer}>
              <View style={[styles.line, { marginRight: 4 }]} />
              <Text style={styles.orText}>Эсвэл</Text>
              <View style={[styles.line, { marginLeft: 4 }]} />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 20,
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
    flex: 1, // input нь боломжит зайг эзэлнэ
    backgroundColor: '#f2f2f2',
    paddingVertical: 10, // дээд доод padding
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8, // icon болон input хооронд зай
    marginBottom: 12, // input хооронд зай
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
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  line: { flex: 1, height: 1, backgroundColor: '#ccc' },
  orText: { textAlign: 'center', marginVertical: 14, color: '#666' },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
});
