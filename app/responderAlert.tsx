import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { db } from '../firebaseConfig';

export default function ResponderAlertScreen() {
  const router = useRouter();

  const [emergency, setEmergency] = useState(null);
  const [distance, setDistance] = useState(null);
  const { responderId } = useLocalSearchParams();
  const [ownName, setOwnName] = useState('');
  const [alreadyResponding, setAlreadyResponding] = useState(false);
  const [alreadyRespondingName, setAlreadyRespondingName] = useState('');
  const [cancelled, setCancelled] = useState(false);

  // Fetch this responder's own name so we can avoid showing the banner to themselves
  useEffect(() => {
    const fetchOwnName = async () => {
      const { getDoc } = await import('firebase/firestore');
      const snap = await getDoc(doc(db, 'responders', responderId as string));
      setOwnName(snap.data()?.name || '');
    };
    if (responderId) fetchOwnName();
  }, [responderId]);

  // Listen to Firebase for the current emergency (including AI fields)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'emergencies', 'current'), async (snap) => {
      const data = snap.data();

      if (data) {
        const age = Date.now() - data.timestamp;
        if (age > 30000) return;

        setEmergency(data);

        if (data.responding) {
          setAlreadyResponding(true);
          setAlreadyRespondingName(data.respondedBy || 'Someone');
        }

        if (data.cancelled) {
          setCancelled(true);
        }

        // Calculate distance from responder to emergency
        const responderLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
        });

        const dist = getDistance(
          responderLocation.coords.latitude,
          responderLocation.coords.longitude,
          data.lat,
          data.lng
        );
        setDistance(dist);
      }
    });
    return () => unsub();
  }, []);

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
    return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // AI fields from Firebase
  const aiActions: string[] = Array.isArray(emergency?.actions) ? emergency.actions : [];
  const hasAIData = aiActions.length > 0 || !!emergency?.summary;

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 64, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {emergency ? (
        <>
          {/* ── Header ── */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-4">
              <Ionicons name="warning" size={40} color="#ef4444" />
            </View>
            <Text className="text-3xl font-bold text-gray-900">Emergency Nearby!</Text>
            <Text className="text-gray-500 text-lg mt-2 text-center">Someone needs immediate help</Text>
          </View>

          {/* ── Emergency info card ── */}
          <View className="w-full border-2 border-red-400 rounded-2xl p-5 bg-red-50 mb-4">

            {/* Type + distance row */}
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="medkit" size={18} color="#ef4444" />
                  <Text className="text-gray-500 text-sm ml-1">Emergency Type</Text>
                </View>
                <Text className="text-gray-900 text-xl font-bold">
                  {emergency?.type || 'Medical Emergency'}
                </Text>
              </View>

              <View>
                <View className="flex-row items-center mb-1">
                  <Ionicons name="location" size={18} color="#ef4444" />
                  <Text className="text-gray-500 text-sm ml-1">Distance</Text>
                </View>
                <Text className="text-gray-900 text-xl font-bold">
                  {distance != null ? `${distance}m` : '...'}
                </Text>
              </View>
            </View>

            {/* AI summary */}
            {emergency?.summary ? (
              <>
                <View className="h-px bg-red-200 mb-4" />
                <View className="flex-row items-center mb-2">
                  <Ionicons name="information-circle" size={18} color="#ef4444" />
                  <Text className="text-gray-500 text-sm ml-1">Situation Summary</Text>
                </View>
                <Text className="text-gray-800 text-base leading-6">
                  {emergency.summary}
                </Text>
              </>
            ) : null}

            {/* Caller's transcript (what they said / typed) */}
            {emergency?.transcript && emergency.transcript !== "(audio)" ? (
              <View className="mt-3 bg-white rounded-xl px-4 py-3 border border-red-200">
                <Text className="text-gray-400 text-xs mb-1">Caller said:</Text>
                <Text className="text-gray-700 text-sm italic">"{emergency.transcript}"</Text>
              </View>
            ) : null}
          </View>

          {/* ── AI Recommended Actions ── */}
          {hasAIData && aiActions.length > 0 && (
            <View className="w-full bg-orange-50 border border-orange-300 rounded-2xl p-5 mb-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name="flash" size={18} color="#ea580c" />
                <Text className="text-orange-700 font-bold text-base ml-1">
                  Recommended First Aid Actions
                </Text>
              </View>
              {aiActions.map((action, index) => (
                <View key={index} className="flex-row items-start mb-3">
                  <View className="w-6 h-6 rounded-full bg-orange-400 items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Text className="text-white font-bold text-xs">{index + 1}</Text>
                  </View>
                  <Text className="text-gray-800 text-base flex-1 leading-6">{action}</Text>
                </View>
              ))}
            </View>
          )}

          {/* ── Already responding banner — hide if it's this responder themselves ── */}
          {alreadyResponding && alreadyRespondingName !== ownName && (
            <View className="w-full bg-blue-50 border border-blue-300 rounded-2xl p-4 mb-4">
              <Text className="text-blue-700 font-bold text-base text-center">
                {alreadyRespondingName} is already on the way
              </Text>
              <Text className="text-blue-500 text-sm text-center mt-1">
                Do you still want to help?
              </Text>
            </View>
          )}

          {/* ── Cancelled banner ── */}
          {cancelled && (
            <View className="w-full bg-gray-100 border border-gray-300 rounded-2xl p-4 mb-4">
              <Text className="text-gray-700 font-bold text-base text-center">✅ False Alarm</Text>
              <Text className="text-gray-500 text-sm text-center mt-1">
                The emergency was cancelled by the caller
              </Text>
            </View>
          )}

          {/* ── CTA buttons ── */}
          <TouchableOpacity
            className={`w-full py-4 rounded-2xl items-center mb-3 ${cancelled ? 'bg-gray-300' : 'bg-red-500'}`}
            disabled={cancelled}
            onPress={async () => {
              const { getDoc, updateDoc } = await import('firebase/firestore');
              const responderSnap = await getDoc(doc(db, 'responders', responderId as string));
              const responderName = responderSnap.data()?.name || 'A responder';

              await updateDoc(doc(db, 'emergencies', 'current'), {
                respondedBy: responderName,
                responderDocId: responderId,   // store so liveLocation can find it
                responding: true,
              });

              router.push({
                pathname: "/liveLocation",
                params: {
                  lat: emergency?.lat,
                  lng: emergency?.lng,
                  responderId: responderId,    // pass through to liveLocation
                }
              });
            }}
          >
            <Text className="text-white font-bold text-lg">
              {alreadyResponding ? "Join Anyway" : "I'm Responding"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full bg-gray-100 py-4 rounded-2xl items-center"
            onPress={async () => {
              const { updateDoc } = await import('firebase/firestore');
              await updateDoc(doc(db, 'emergencies', 'current'), { declined: true });
              router.back();
            }}
          >
            <Text className="text-gray-700 font-bold text-lg">Unavailable</Text>
          </TouchableOpacity>
        </>
      ) : (
        // ── No emergency ──
        <View className="flex-1 justify-center items-center mt-32">
          <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-6">
            <Ionicons name="shield-checkmark" size={50} color="#22c55e" />
          </View>
          <Text className="text-3xl font-bold text-gray-900">All Clear</Text>
          <Text className="text-gray-500 text-lg mt-3 text-center">
            Everyone is safe at the moment.{'\n'}You'll be notified if help is needed.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}