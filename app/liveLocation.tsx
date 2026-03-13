import { Text, View } from "react-native";

export default function LiveLocationScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-gray-800">Live Map</Text>
      <Text className="text-gray-500 mt-2">Tracking nearby responders...</Text>
    </View>
  );
}