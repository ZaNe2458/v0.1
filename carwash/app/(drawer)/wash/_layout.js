// app/(drawer)/wash/_layout.js
import { Stack } from 'expo-router';

export default function WashLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="detail" />
    </Stack>
  );
}
