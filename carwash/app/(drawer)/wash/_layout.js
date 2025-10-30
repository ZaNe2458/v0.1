import { Stack } from 'expo-router';

export default function CarsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="CarWashesDetail" />
    </Stack>
  );
}
