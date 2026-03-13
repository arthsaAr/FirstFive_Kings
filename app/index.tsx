import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function InitialHomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold text-red-500">FirstFive</Text>
      <Text className="text-gray-500 mt-2">Help arrives before the ambulance!</Text>

      <TouchableOpacity
        className="mt-10 w-full bg-red-500 py-4 rounded-2xl items-center"
        onPress={() => router.push("/responderSetup")}
      >
        <Text className="text-white font-bold text-lg">I Want to Help</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-4 w-full bg-gray-100 py-4 rounded-2xl items-center"
        onPress={() => router.push("/home")}
      >
        <Text className="text-gray-700 font-bold text-lg">Continue as User</Text>
      </TouchableOpacity>
    </View>
  );
}