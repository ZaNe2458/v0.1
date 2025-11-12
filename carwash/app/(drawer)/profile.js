// app/profile/profile.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import defaultPhoto from '../../src/assets/images/default-avatar.avif';
import anotherPhoto from '../../src/assets/logos/shine.jpg';

const STORAGE = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
};
const BASE_URL = 'http://20.205.137.59:8000';

function mapProfile(raw) {
  return {
    firstName: raw?.first_name ?? raw?.given_name ?? '',
    lastName: raw?.last_name ?? raw?.family_name ?? '',
    phone: raw?.phone ?? raw?.phone_number ?? '',
    email: raw?.email ?? raw?.contact_email ?? '',
    avatar: raw?.avatar_url ?? raw?.avatar ?? null,
  };
}

export default function ProfileScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(defaultPhoto);
  const [showPassword, setShowPassword] = useState(false);
  const [maskedPassword, setMaskedPassword] = useState('********');
  const [pwModal, setPwModal] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [newPw2, setNewPw2] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const changeImage = () =>
    setImage((img) => (img === defaultPhoto ? anotherPhoto : defaultPhoto));

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const access = await AsyncStorage.getItem(STORAGE.AUTH_TOKEN);
      if (!access) {
        router.replace('/login');
        return;
      }
      console.log('ACCESS TOKEN:', access);

      const res = await fetch(`${BASE_URL}/api/auth/me/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      const json = await res.json();
      const userData = json?.data ?? json; // ← энд шалгалт
      const p = mapProfile(userData);

      setFirstName(p.firstName);
      setLastName(p.lastName);
      setPhone(p.phone);
      setEmail(p.email);
      if (p.avatar) setImage({ uri: p.avatar });
    } catch {
      Alert.alert('Алдаа', 'Профайл мэдээлэл татахад алдаа гарлаа.');
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {
      const access = await AsyncStorage.getItem(STORAGE.AUTH_TOKEN);
      if (!access) {
        router.replace('/login');
        return;
      }

      const body = { first_name: firstName, last_name: lastName, phone };
      const res = await fetch(`${BASE_URL}/api/auth/me/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed');
      Alert.alert('Амжилттай', 'Профайл шинэчлэгдлээ.');
      fetchProfile();
    } catch {
      Alert.alert('Алдаа', 'Профайл шинэчлэхэд алдаа гарлаа.');
    }
  };

  const submitPasswordChange = async () => {
    if (newPw.length < 6)
      return Alert.alert('Алдаа', 'Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой.');
    if (newPw !== newPw2)
      return Alert.alert('Алдаа', 'Нууц үг хоёр талбарт ижил байх ёстой.');
    try {
      setPwLoading(true);
      const access = await AsyncStorage.getItem(STORAGE.AUTH_TOKEN);
      if (!access) {
        router.replace('/login');
        return;
      }
      const res = await fetch(`${BASE_URL}/api/auth/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ new_password: newPw }),
      });
      if (!res.ok) throw new Error('Failed');
      setMaskedPassword('*'.repeat(newPw.length));
      setPwModal(false);
      setNewPw('');
      setNewPw2('');
      Alert.alert('Амжилттай', 'Нууц үг солигдлоо.');
    } catch {
      Alert.alert('Алдаа', 'Нууц үг солих үед алдаа гарлаа.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const refresh = (await AsyncStorage.getItem(STORAGE.REFRESH_TOKEN)) ?? '';
      await fetch(`${BASE_URL}/api/auth/logout/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      }).catch(() => {});
      await AsyncStorage.multiRemove([
        STORAGE.AUTH_TOKEN,
        STORAGE.REFRESH_TOKEN,
      ]);
      router.replace('/login');
    } catch {
      Alert.alert('Алдаа', 'Гарах үед асуудал гарлаа.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          <TouchableOpacity onPress={changeImage} style={styles.imageWrapper}>
            <Image source={image} style={styles.image} />
            <View style={styles.imageFab}>
              <Feather name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {firstName || lastName ? `${firstName} ${lastName}`.trim() : '—'}
            </Text>
            <Text style={styles.subtext}>{email || 'И-мэйл: Бүртгээгүй'}</Text>
            <Text style={styles.subtext}>Утас: {phone || 'Бүртгээгүй'}</Text>
          </View>
        </View>

        <View style={styles.separator} />
        <Text style={styles.sectionTitle}>Хувийн мэдээлэл</Text>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <View style={styles.fieldRow}>
              <Feather
                name="user"
                size={18}
                color="#64748B"
                style={styles.leftIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Овог (last)"
                placeholderTextColor="#94A3B8"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.fieldRow}>
              <Feather
                name="user"
                size={18}
                color="#64748B"
                style={styles.leftIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Нэр (first)"
                placeholderTextColor="#94A3B8"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Feather
            name="phone"
            size={18}
            color="#64748B"
            style={styles.leftIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Утас"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.fieldRow}>
          <Feather
            name="mail"
            size={18}
            color="#64748B"
            style={styles.leftIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="И-мэйл"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={saveProfile}>
          <Feather name="save" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>
            {loadingProfile ? 'Уншиж байна…' : 'Хадгалах'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Аюулгүй байдал</Text>
        <View style={styles.fieldRow}>
          <Feather
            name="lock"
            size={18}
            color="#64748B"
            style={styles.leftIcon}
          />
          <TextInput
            style={styles.input}
            value={
              showPassword ? maskedPassword.replace(/\*/g, '•') : maskedPassword
            }
            editable={false}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            style={styles.eyeBtn}
          >
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={18}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => setPwModal(true)}
        >
          <Feather name="refresh-ccw" size={18} color="#2563EB" />
          <Text style={styles.secondaryBtnText}>Нууц үг солих</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator />
        ) : (
          <>
            <Feather name="log-out" size={18} color="#fff" />
            <Text style={styles.logoutText}>Гарах</Text>
          </>
        )}
      </TouchableOpacity>

      <Modal
        visible={pwModal}
        animationType="slide"
        transparent
        onRequestClose={() => setPwModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Нууц үг солих</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Шинэ нууц үг"
              secureTextEntry
              value={newPw}
              onChangeText={setNewPw}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Шинэ нууц үг (давт)"
              secureTextEntry
              value={newPw2}
              onChangeText={setNewPw2}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setPwModal(false)}
              >
                <Text style={styles.modalCancelText}>Болих</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOk}
                onPress={submitPasswordChange}
                disabled={pwLoading}
              >
                {pwLoading ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.modalOkText}>Хадгалах</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 16,
    paddingTop: 48,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  avatarRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  imageWrapper: { position: 'relative' },
  image: { width: 84, height: 84, borderRadius: 42 },
  imageFab: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    backgroundColor: '#2563EB',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  subtext: { color: '#64748B', marginTop: 2 },
  separator: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
  sectionTitle: { fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
  },
  leftIcon: { marginLeft: 10 },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  eyeBtn: { paddingHorizontal: 12, paddingVertical: 10 },
  primaryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: {
    borderColor: '#2563EB',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: { color: '#2563EB', fontWeight: '700' },
  logoutBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: { color: '#fff', fontWeight: '700' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#0F172A',
  },
  modalInput: {
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  modalCancel: { paddingVertical: 10, paddingHorizontal: 14 },
  modalCancelText: { color: '#64748B', fontWeight: '600' },
  modalOk: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalOkText: { color: '#fff', fontWeight: '700' },
});
