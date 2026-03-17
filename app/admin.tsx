import BottomBar from "@/components/bottom-bar";
import TopBar from "@/components/top-bar";
import { useRouter } from "expo-router";
import {
  Package,
  ShoppingBag
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { bg } from "../assets/css/css";

interface AdminOption {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  description: string;
  redirectTo: string;
}

const ADMIN_OPTIONS: AdminOption[] = [
  {
    id: "products",
    icon: ShoppingBag,
    label: "Products",
    description: "Manage your product catalog",
    redirectTo: "/admin/products",
  },
  {
    id: "inventory",
    icon: Package,
    label: "Inventory",
    description: "Track stock and inventory",
    redirectTo: "/admin/inventory",
  },
];

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <TopBar title="Admin" showBackButton />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Manage your store</Text>

        {ADMIN_OPTIONS.map((option) => {
          const Icon = option.icon;

          return (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => router.push(option.redirectTo)}
            >
              <View style={styles.iconContainer}>
                <Icon size={28} color={bg.tertiary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121317",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1D21",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2A2B30",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    color: "#888",
    fontSize: 13,
  },
  arrow: {
    color: "#aaa",
    fontSize: 22,
  },
});
