import BottomBar from "@/components/bottom-bar";
import TopBar from "@/components/top-bar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  LogOut,
  MapPin,
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
interface MenuItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  redirectTo: string
}

const MENU_ITEMS: MenuItem[] = [
  { id: "1", icon: ShoppingBag, label: "My Products", redirectTo: "/products" },
  { id: "4", icon: MapPin, label: "My Catalogs", redirectTo: "/catalog" },
  // { id: "2", icon: ShoppingCart, label: "My Cart" },
  // { id: "3", icon: Heart, label: "My Wishlist" },
  // { id: "5", icon: Wallet, label: "My Wallet" },
  // { id: "6", icon: HelpCircle, label: "Help & Support" },
];

export default function AccountScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>

      {/* Header */}
      <TopBar title="MY Account" />

      <ScrollView contentContainerStyle={styles.content}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.name}>{user?.fullName}</Text>

          {user?.phone &&
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{user?.phone}</Text>
            </View>
          }

          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <View style={styles.walletBox}>
            <Text style={styles.label}>Plan:</Text>
            <Text style={styles.wallet}>Pro</Text>
          </View>
        </View>

        {/* Menu Items */}
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={()=>{
              router.push(item.redirectTo)
            }} >
              <View style={styles.menuLeft}>
                <Icon size={22} color={bg.tertiary} />
                <Text style={styles.menuText}>{item.label}</Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          );
        })}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.push("/")}
        >
          <LogOut size={20} color="#E69126" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Navigation */}
      <BottomBar />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121317",
    // backgroundColor: "#0f172a",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },

  profileCard: {
    backgroundColor: "#1C1D21",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    marginBottom: 6,
  },

  label: {
    color: "#ddd",
    marginRight: 6,
  },

  value: {
    color: "#aaa",
  },

  walletBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1C1D21",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },

  wallet: {
    color: "#E69126",
    fontWeight: "bold",
    fontSize: 16,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1C1D21",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  menuText: {
    color: "#fff",
    fontWeight: "600",
  },

  arrow: {
    color: "#aaa",
    fontSize: 18,
  },

  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1D1C21",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },

  logoutText: {
    color: "#E69126",
    fontWeight: "bold",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#1e293b",
    backgroundColor: "#0f172a",
    paddingVertical: 10,
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    color: "#fff",
    fontSize: 12,
  },

  scanButton: {
    backgroundColor: bg,
    padding: 16,
    borderRadius: 40,
  },
});