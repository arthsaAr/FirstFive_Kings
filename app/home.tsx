import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <TouchableOpacity
        className="w-56 h-56 rounded-full bg-red-500 justify-center items-center"
        onPress={() => router.push("/alert")}
      >
        <Text className="text-white text-2xl font-bold">EMERGENCY</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-10 w-full bg-gray-100 py-4 rounded-2xl items-center"
        onPress={() => router.push("/chat")}
      >
        <Text className="text-gray-700 font-bold text-lg">AI Guidance</Text>
      </TouchableOpacity>
    </View>
  );
}