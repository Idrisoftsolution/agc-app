import { bg } from "@/assets/css/css";
import BottomBar from "@/components/bottom-bar";
import TopBar from "@/components/top-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Heart
} from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

const PRODUCTS_BY_CATEGORY: { [key: string]: Product[] } = {
  "1": [
    { id: "v1", name: "Tomatoes", price: "₹40/kg", image: "🍅", category: "1" },
    { id: "v2", name: "Potatoes", price: "₹30/kg", image: "🥔", category: "1" },
    { id: "v3", name: "Onions", price: "₹35/kg", image: "🧅", category: "1" },
  ],
};

const CATEGORY_NAMES: { [key: string]: string } = {
  "1": "Vegetables",
};

export default function ProductsScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const categoryId = category || "1";
  const products = PRODUCTS_BY_CATEGORY[categoryId] || [];
  const categoryName = CATEGORY_NAMES[categoryId] || "Products";

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) newWishlist.delete(productId);
    else newWishlist.add(productId);
    setWishlist(newWishlist);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      
      <TopBar title= "Products"/>

      {/* Products */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageBox}>
              <Text style={styles.emoji}>{item.image}</Text>
            </View>

            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cartButton}>
                <Text style={styles.cartText}>Add</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.wishlist}
                onPress={() => toggleWishlist(item.id)}
              >
                <Heart
                  size={18}
                  color={wishlist.has(item.id) ? "red" : "#fff"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Bottom Navigation */}
      <BottomBar/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bg.primary,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  listContainer: {
    paddingTop: 16,
    paddingBottom: 120,
  },

  row: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  card: {
    flex: 1,
    backgroundColor: bg.secondary,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 4,
  },

  imageBox: {
    backgroundColor: bg.primary,
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    marginBottom: 8,
  },

  emoji: {
    fontSize: 32,
  },

  productName: {
    color: "#fff",
    fontWeight: "600",
  },

  price: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },

  cartButton: {
    flex: 1,
    backgroundColor: bg.tertiary,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 6,
  },

  cartText: {
    textAlign: "center",
    fontWeight: "600",
  },

  wishlist: {
    padding: 6,
    backgroundColor:bg.primary,
    borderRadius: 6,
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
    paddingVertical: 10,
    backgroundColor: "#0f172a",
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    color: "#fff",
    fontSize: 12,
  },

  scanButton: {
    backgroundColor: "#d4af37",
    padding: 16,
    borderRadius: 40,
  },
});