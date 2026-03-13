import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AIChatScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello, I'm here to help guide you through this emergency. Can you describe what's happening?",
      isAI: true,
      timestamp: new Date(),
    }
  ]);

  const scrollViewRef = useRef(null);
  const quickMessages = ["Not breathing", "Bleeding", "Choking"];   //can change later

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: text.trim(),
      isAI: false,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate AI response (you'll replace this with actual API call)
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "I understand. Let me help you with that. Stay calm and follow these steps...!",
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickMessage = (quickMsg) => {
    sendMessage(quickMsg);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View className="bg-red-500 border-b border-gray-200 px-6 pt-4 pb-3">
        <Text className="text-3xl font-bold mt-2 text-white">Emergency Guidance</Text>
        <Text className="text-white text-lg mt-1">AI-powered first aid assistant</Text>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-5 py-5"
        contentContainerStyle={{ paddingBottom: 15 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View 
            key={msg.id}
            className={`flex-row mb-5 ${msg.isAI ? "" : "justify-end"}`}
          >
            {msg.isAI && (
              <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mr-3 mt-1">
                <Ionicons name="logo-robot" size={22} color="#ef4444" />
              </View>
            )}
            
            <View 
              className={`max-w-[75%] px-5 py-4 rounded-2xl ${
                msg.isAI 
                  ? "bg-gray-100" 
                  : "bg-red-500"
              }`}
            >
              <Text className={msg.isAI ? "text-gray-800" : "text-white"}
              style={{ fontSize: 16, lineHeight: 22 }}
              >
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Quick Messages */}
      <View className="px-5 pb-3">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="flex-row gap-2"
        >
          {quickMessages.map((quickMsg, index) => (
            <TouchableOpacity
              key={index}
              className="bg-red-50 border border-red-200 px-5 py-3 rounded-full mr-2"
              onPress={() => handleQuickMessage(quickMsg)}
              activeOpacity={0.7}
            >
              <Text className="text-red-600 font-semibold">{quickMsg}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Area */}
      <View className="px-5 pb-8 pt-3 bg-white border-t border-gray-200">
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-gray-800"
            placeholder="Type your message..."
            placeholderTextColor="#9ca3af"
            value={message}
            style={{ fontSize: 16 }}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            className="w-14 h-14 bg-red-500 rounded-full items-center justify-center"
            onPress={() => sendMessage(message)}
            activeOpacity={0.7}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}