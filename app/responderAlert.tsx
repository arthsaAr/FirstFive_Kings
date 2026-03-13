import { Text, TouchableOpacity, View } from "react-native";
 
export default function ResponderAlertScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold text-red-500">Emergency Nearby!</Text>
      <Text className="text-gray-500 mt-2">Someone needs help 0.3 km away.</Text>
 
      <TouchableOpacity className="mt-8 w-full bg-red-500 py-4 rounded-2xl items-center">
        <Text className="text-white font-bold text-lg">I'm Responding</Text>
      </TouchableOpacity>
 
      <TouchableOpacity className="mt-4 w-full bg-gray-100 py-4 rounded-2xl items-center">
        <Text className="text-gray-700 font-bold text-lg">Unavailable</Text>
      </TouchableOpacity>
    </View>
  );
}