// app/_layout.js
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(drawer)" />
      <Stack.Screen name="AddCarScreen" />
      <Stack.Screen
        name="CarWashDetail"
        options={{ headerTransparent: true }}
      />
    </Stack>
  );
}
