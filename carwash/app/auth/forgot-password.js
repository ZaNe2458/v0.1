import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { forgotPassword } from '../../src/api/auth'; // ⬅️ API хувилбар

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const identity = usernameOrEmail.trim();
    if (!identity) {
      Alert.alert('Анхаар', 'Хэрэглэгчийн нэр эсвэл имэйл оруулна уу.');
      return;
    }
    try {
      setLoading(true);
      const res = await forgotPassword(identity);
      if (res?.status === 'ok' || res?.detail) {
        Alert.alert(
          'Амжилттай',
          'Нууц үг сэргээх линк/код таны имэйл рүү илгээгдлээ.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Алдаа', res?.message || 'Дахин оролдоно уу.');
      }
    } catch (e) {
      Alert.alert(
        'Алдаа',
        e?.response?.data?.detail || 'Сэргээхэд алдаа гарлаа.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Нууц үг сэргээх</Text>
        <Text style={styles.desc}>
          Бүртгэлтэй имэйл эсвэл хэрэглэгчийн нэрээ оруулна уу.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="username эсвэл email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={usernameOrEmail}
          onChangeText={setUsernameOrEmail}
        />

        <TouchableOpacity
          onPress={onSubmit}
          style={[styles.button, loading && { opacity: 0.6 }]}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Илгээж байна...' : 'Илгээх'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.linkBtn}>
          <Text style={styles.linkText}>Буцах</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  desc: { textAlign: 'center', color: '#666', marginTop: 8, marginBottom: 16 },
  input: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
    height: 48,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  linkBtn: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#007bff' },
});
