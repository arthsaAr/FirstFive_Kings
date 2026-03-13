import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">

      <TouchableOpacity
        className="w-64 mb-5 h-64 rounded-full bg-red-500 justify-center items-center"
        onPress={() => router.push("/alert")}
      >
        <Text className="text-white text-3xl font-bold">EMERGENCY</Text>
      </TouchableOpacity>

      <View className="text-center justify-center">
        <Text className="text-xl mt-3 font-normal text-gray-600">Press if someone needs immediate help</Text>
      </View>

      <TouchableOpacity
        className="mt-7 w-full border border-gray-500 bg-gray-100 py-4 rounded-2xl items-center"
        onPress={() => router.push("/chat")}
      >
        <Text className="text-gray-700 font-bold text-lg">AI Guidance</Text>
      </TouchableOpacity>
    </View>
  );
}