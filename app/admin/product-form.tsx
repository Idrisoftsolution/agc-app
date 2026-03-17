import { bg } from "@/assets/css/css";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { addProduct, updateProduct } from "../../services/product";

interface Product {
  id: string;
  name: string;
  slug: string;
  catalogue: string;
  material: string;
  price: number;
  stock?: number;
  description?: string;
  tags?: string[];
  image: {
    source: string;
    key: string;
  };
}

const MATERIALS = ["gold", "silver", "diamond", "platinum", "artificial"];
const CATALOGUES = ["rings", "necklaces", "bracelets", "earrings", "pendants", "bangles", "chains", "watches", "other"];

export default function ProductFormScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const editProduct: Product | null = params.product ? JSON.parse(params.product as string) : null;
  const isEditMode = !!editProduct;

  const [name, setName] = useState(editProduct?.name || "");
  const [slug, setSlug] = useState(editProduct?.slug || "");
  const [catalogue, setCatalogue] = useState(editProduct?.catalogue || "");
  const [material, setMaterial] = useState(editProduct?.material || "");
  const [price, setPrice] = useState(editProduct?.price?.toString() || "");
  const [stock, setStock] = useState(editProduct?.stock?.toString() || "0");
  const [description, setDescription] = useState(editProduct?.description || "");
  const [imageSource, setImageSource] = useState(editProduct?.image?.source || "");
  const [imageKey, setImageKey] = useState(editProduct?.image?.key || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      setSlug(name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  }, [name]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Product name is required");
      return;
    }
    if (!slug.trim()) {
      Alert.alert("Error", "Product slug is required");
      return;
    }
    if (!catalogue) {
      Alert.alert("Error", "Please select a catalogue");
      return;
    }
    if (!material) {
      Alert.alert("Error", "Please select a material");
      return;
    }
    if (!price || parseFloat(price) < 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }
    if (!imageSource.trim()) {
      Alert.alert("Error", "Image source URL is required");
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        catalogue,
        material,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        description: description.trim(),
        image: {
          source: imageSource.trim(),
          key: imageKey.trim() || `img_${Date.now()}`,
        },
      };

      const token = "user-token"; // Get from auth context

      let response;
      if (isEditMode && editProduct) {
        response = await updateProduct(editProduct.id, productData, token);
      } else {
        response = await addProduct(productData, token);
      }

      if (response.success) {
        Alert.alert(
          "Success",
          isEditMode ? "Product updated successfully" : "Product created successfully",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        Alert.alert("Error", response.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert("Error", "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (
    label: string,
    value: string,
    options: string[],
    onSelect: (value: string) => void
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dropdownContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.dropdownOption, value === option && styles.dropdownOptionSelected]}
            onPress={() => onSelect(option)}
          >
            <Text style={[styles.dropdownOptionText, value === option && styles.dropdownOptionTextSelected]}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditMode ? "Edit Product" : "Add Product"}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter product name"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Slug *</Text>
          <TextInput
            style={styles.input}
            value={slug}
            onChangeText={setSlug}
            placeholder="product-slug"
            placeholderTextColor="#666"
            autoCapitalize="none"
          />
        </View>

        {renderDropdown("Catalogue *", catalogue, CATALOGUES, setCatalogue)}

        {renderDropdown("Material *", material, MATERIALS, setMaterial)}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price (₹) *</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Stock</Text>
          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            placeholder="0"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter product description"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Image URL *</Text>
          <TextInput
            style={styles.input}
            value={imageSource}
            onChangeText={setImageSource}
            placeholder="https://..."
            placeholderTextColor="#666"
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Image Key</Text>
          <TextInput
            style={styles.input}
            value={imageKey}
            onChangeText={setImageKey}
            placeholder="image-key"
            placeholderTextColor="#666"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1C1D21",
    borderRadius: 8,
    padding: 14,
    color: "#fff",
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dropdownContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dropdownOption: {
    backgroundColor: "#1C1D21",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2A2B30",
  },
  dropdownOptionSelected: {
    backgroundColor: bg.tertiary,
    borderColor: bg.tertiary,
  },
  dropdownOptionText: {
    color: "#aaa",
    fontSize: 14,
  },
  dropdownOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: bg.tertiary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
