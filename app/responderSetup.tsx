import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function ResponderSetupScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold text-gray-800">Responder Setup</Text>
      <Text className="text-gray-500 mt-2">Set up your responder profile.</Text>

      <TouchableOpacity
        className="mt-10 w-full bg-red-500 py-4 rounded-2xl items-center"
        onPress={() => router.push("/home")}
      >
        <Text className="text-white font-bold text-lg">Complete Registration</Text>
      </TouchableOpacity>
    </View>
  );
}