import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="responderSetup" />
      <Stack.Screen name="responderAlert" />
      <Stack.Screen name="liveLocation" />
      <Stack.Screen name="alert" />
      <Stack.Screen name="chat" />
    </Stack>
  );
}