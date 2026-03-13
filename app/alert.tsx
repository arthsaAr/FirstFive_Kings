import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function EmergencyTriggeredScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-red-500 px-6">
      <Text className="text-white text-3xl font-bold">Emergency Sent!</Text>
      <Text className="text-white text-base mt-4">Notifying nearby responders...</Text>

      <TouchableOpacity
        className="mt-10 w-full bg-white py-4 rounded-2xl items-center"
        onPress={() => router.push("/liveLocation")}
      >
        <Text className="text-red-500 font-bold text-lg">View Map</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-4 w-full bg-red-700 py-4 rounded-2xl items-center"
        onPress={() => router.push("/chat")}
      >
        <Text className="text-white font-bold text-lg">Get AI Guidance</Text>
      </TouchableOpacity>
    </View>
  );
}