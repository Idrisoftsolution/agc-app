import { bg } from "@/assets/css/css";
import BottomBar from "@/components/bottom-bar";
import FileUpload from "@/components/ui/FileUpload";
import { useAuth } from "@/context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
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

interface ProductImage {
  source: string;
  key: string;
}

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
  image: ProductImage;
}

interface FormState {
  name: string;
  slug: string;
  catalogue: string;
  material: string;
  price: string;
  stock: string;
  description: string;
  image: ProductImage;
}

interface FormErrors {
  name?: string;
  slug?: string;
  catalogue?: string;
  material?: string;
  price?: string;
  image?: string;
}

const MATERIALS = ["gold", "silver", "diamond", "platinum", "artificial"];
const CATALOGUES = ["rings", "necklaces", "bracelets", "earrings", "pendants", "bangles", "chains", "watches", "other"];

export default function ProductFormScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { token } = useAuth();
  
  const editProduct: Product | null = params.product ? JSON.parse(params.product as string) : null;
  const isEditMode = !!editProduct;

  const [formState, setFormState] = useState<FormState>({
    name: editProduct?.name || "",
    slug: editProduct?.slug || "",
    catalogue: editProduct?.catalogue || "",
    material: editProduct?.material || "",
    price: editProduct?.price?.toString() || "",
    stock: editProduct?.stock?.toString() || "0",
    description: editProduct?.description || "",
    image: {
      source: editProduct?.image?.source || "",
      key: editProduct?.image?.key || "",
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof FormState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formState.name.trim().length < 2) {
      newErrors.name = "Product name must be at least 2 characters";
    }

    if (!formState.slug.trim()) {
      newErrors.slug = "Product slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formState.slug.trim())) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (!formState.catalogue) {
      newErrors.catalogue = "Please select a catalogue";
    }

    if (!formState.material) {
      newErrors.material = "Please select a material";
    }

    if (!formState.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(formState.price)) || parseFloat(formState.price) < 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formState.image.source.trim()) {
      newErrors.image = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!isEditMode && formState.name) {
      const slug = formState.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      updateField("slug", slug);
    }
  }, [formState.name]);

  const handleSubmit = async () => {
    console.log("Form state:", formState);
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: formState.name.trim(),
        slug: formState.slug.trim().toLowerCase(),
        catalogue: formState.catalogue,
        material: formState.material,
        price: parseFloat(formState.price),
        stock: formState.stock ? parseInt(formState.stock) : 0,
        description: formState.description.trim(),
        image: {
          source: formState.image.source.trim(),
          key: formState.image.key.trim() || `img_${Date.now()}`,
        },
      };

      console.log("Submitting product:", productData);

      let response;
      if (isEditMode && editProduct) {
        response = await updateProduct(editProduct.id, productData, token || '');
      } else {
        response = await addProduct(productData, token || '');
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
    onSelect: (value: string) => void,
    error?: string
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dropdownContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.dropdownOption,
              value === option && styles.dropdownOptionSelected,
              error && styles.dropdownOptionError
            ]}
            onPress={() => onSelect(option)}
          >
            <Text style={[
              styles.dropdownOptionText,
              value === option && styles.dropdownOptionTextSelected
            ]}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
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
            style={[styles.input, errors.name && styles.inputError]}
            value={formState.name}
            onChangeText={(value) => updateField("name", value)}
            placeholder="Enter product name"
            placeholderTextColor="#666"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Slug *</Text>
          <TextInput
            style={[styles.input, errors.slug && styles.inputError]}
            value={formState.slug}
            onChangeText={(value) => updateField("slug", value)}
            placeholder="product-slug"
            placeholderTextColor="#666"
            autoCapitalize="none"
          />
          {errors.slug && <Text style={styles.errorText}>{errors.slug}</Text>}
        </View>

        {renderDropdown("Catalogue *", formState.catalogue, CATALOGUES, (value) => updateField("catalogue", value), errors.catalogue)}

        {renderDropdown("Material *", formState.material, MATERIALS, (value) => updateField("material", value), errors.material)}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price (₹) *</Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            value={formState.price}
            onChangeText={(value) => updateField("price", value)}
            placeholder="Enter price"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Stock</Text>
          <TextInput
            style={styles.input}
            value={formState.stock}
            onChangeText={(value) => updateField("stock", value)}
            placeholder="0"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formState.description}
            onChangeText={(value) => updateField("description", value)}
            placeholder="Enter product description"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
        </View>

        <FileUpload
          label="Product Image *"
          folder="products"
          currentUrl={formState.image.source}
          currentKey={formState.image.key}
          onUploadComplete={(data) => {
            updateField("image", { source: data.url, key: data.key });
          }}
        />
        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

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
    borderWidth: 1,
    borderColor: "#2A2B30",
  },
  inputError: {
    borderColor: "#F44336",
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
  dropdownOptionError: {
    borderColor: "#F44336",
  },
  dropdownOptionText: {
    color: "#aaa",
    fontSize: 14,
  },
  dropdownOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  errorText: {
    color: "#F44336",
    fontSize: 12,
    marginTop: 4,
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
