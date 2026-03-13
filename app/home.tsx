import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [locationEnabled, setLocationEnabled] = useState(false);
 
  // Check location permission(same like respondeer setup page)
  useEffect(() => {
    checkLocationPermission();
  }, []);
 
  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setLocationEnabled(status === 'granted');
  };
 
  const handleEmergency = async () => {
    // Check if location is enabled
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        "Location Required",
        "Please enable location services to send an emergency alert.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Enable Location", 
            onPress: async () => {
              const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
              if (newStatus === 'granted') {
                setLocationEnabled(true);
                router.push("/alert");
              }
            }
          },
        ]
      );
      return;
    }
 
    // Location is enabled, proceed to alert
    router.push("/alert");
  };
 
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">

      <TouchableOpacity
        className="w-64 mb-5 h-64 rounded-full bg-red-500 justify-center items-center"
        onPress={handleEmergency}
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