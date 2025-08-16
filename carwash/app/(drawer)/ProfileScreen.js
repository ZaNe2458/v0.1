import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import defaultPhoto from '../../assets/images/default-avatar.avif';
import anotherPhoto from '../../assets/logos/shine.jpg';

export default function ProfileScreen() {
  const [name, setName] = useState('Батболд');
  const [phone, setPhone] = useState('88848848');
  const [password, setPassword] = useState('********');
  const [showPassword, setShowPassword] = useState(false);

  const [image, setImage] = useState(defaultPhoto);

  const changeImage = () => {
    setImage(image === defaultPhoto ? anotherPhoto : defaultPhoto);
  };

  const changePassword = () => {
    Alert.prompt(
      'Нууц үг солих',
      'Шинэ нууц үгээ оруулна уу',
      [
        { text: 'Цуцлах', style: 'cancel' },
        {
          text: 'Хадгалах',
          onPress: (newPassword) => {
            if (newPassword && newPassword.length >= 6) {
              setPassword('*'.repeat(newPassword.length));
              Alert.alert('Амжилттай', 'Нууц үг солигдлоо');
            } else {
              Alert.alert('Алдаа', 'Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой');
            }
          },
        },
      ],
      'secure-text'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={changeImage} style={styles.imageWrapper}>
          <Image source={image} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={changeImage} style={styles.changePhotoBtn}>
          <Feather name="camera" size={16} color="#fff" />
          <Text style={styles.changePhotoText}> Зураг солих</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Нэр</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Утасны дугаар</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Нууц үг</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={password}
            secureTextEntry={!showPassword}
            editable={false}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={changePassword}
          style={styles.changePasswordBtn}
        >
          <Text style={styles.changePasswordText}>Нууц үг солих</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
    paddingTop: 100,
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, color: '#333' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  imageWrapper: { alignSelf: 'center', marginBottom: 10 },
  image: { width: 120, height: 120, borderRadius: 60 },
  changePhotoBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3399FF',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  changePhotoText: { color: '#fff', marginLeft: 5, fontWeight: '600' },
  label: { fontWeight: '600', marginBottom: 5, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  changePasswordBtn: {
    backgroundColor: '#3399FF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  changePasswordText: { color: '#fff', fontWeight: '600' },
});
