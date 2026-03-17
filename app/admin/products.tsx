import { bg } from "@/assets/css/css";
import BottomBar from "@/components/bottom-bar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Edit,
  Plus,
  Trash2
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AlertDialog, { AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deleteProduct, getProductsByUserId } from "../../services/product";

interface Product {
  id: string;
  name: string;
  slug: string;
  catalogue: string;
  material: string;
  price: number;
  stock: number;
  description?: string;
  tags?: string[];
  image: {
    source: string;
    key: string;
  };
}

const MATERIALS = ["gold", "silver", "diamond", "platinum", "artificial"];
const CATALOGUES = ["rings", "necklaces", "bracelets", "earrings", "pendants", "bangles", "chains", "watches", "other"];

export default function AdminProductsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {user} = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProductsByUserId(user?.id || "");
      if (response.success) {
        setProducts(response.products || []);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const token = "user-token"; // Get from auth context
      const response = await deleteProduct(productToDelete, token);
      if (response.success) {
        setProducts(products.filter(p => p.id !== productToDelete));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        {item.image?.source ? (
          <Image source={{ uri: item.image.source }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
        <View style={styles.tagsContainer}>
          <Text style={styles.tag}>{item.catalogue}</Text>
          <Text style={styles.tag}>{item.material}</Text>
        </View>
        {item.stock !== undefined && (
          <Text style={styles.stock}>Stock: {item.stock}</Text>
        )}
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push({ pathname: "/admin/product-form", params: { product: JSON.stringify(item) } })}
        >
          <Edit size={18} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteClick(item.id)}
        >
          <Trash2 size={18} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Products</Text>
        <View style={{ width: 26 }} />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/admin/product-form")}
      >
        <Plus size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Product</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products yet</Text>
          <Text style={styles.emptySubtext}>Tap "Add Product" to create your first product</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <AlertDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen}>
        <AlertDialogTitle>Delete Product</AlertDialogTitle>
        <AlertDialogDescription>Are you sure you want to delete this product? This action cannot be undone.</AlertDialogDescription>
        <View style={styles.dialogFooter}>
          <AlertDialogCancel onPress={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onPress={confirmDelete}>Delete</AlertDialogAction>
        </View>
      </AlertDialog>

      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121317",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: bg.tertiary,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#1C1D21",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  productImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2A2B30",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#666",
    fontSize: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  productPrice: {
    color: bg.tertiary,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  tag: {
    backgroundColor: "#2A2B30",
    color: "#aaa",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stock: {
    color: "#888",
    fontSize: 12,
  },
  productActions: {
    justifyContent: "center",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120,
  },
  emptyText: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#666",
    fontSize: 13,
  },
  dialogFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
});
