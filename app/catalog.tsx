import { bg } from "@/assets/css/css";
import BottomBar from "@/components/bottom-bar";
import TopBar from "@/components/top-bar";
import { useRouter } from "expo-router";
import {
    Bell,
    Carrot,
    Search
} from "lucide-react-native";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface Category {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    count: number;
}

const CATEGORIES: Category[] = [
    { id: "1", name: "Vegetables", icon: Carrot, count: 45 },
];

export default function CatalogScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <SafeAreaView style={[styles.container]}>

            <TopBar title="Catalogue" />


            {/* Search */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Search size={18} color="#aaa" />
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                    />
                </View>

                <TouchableOpacity>
                    <Bell size={22} color={bg.tertiary} />
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <ScrollView>
                <View style={styles.grid}>
                    {CATEGORIES.map((category) => {
                        const Icon = category.icon;

                        return (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.card}
                                onPress={() =>
                                    router.push(`/products?category=${category.id}`)
                                }
                            >
                                <Icon size={30} color={bg.tertiary} />
                                <Text style={styles.cardTitle}>{category.name}</Text>
                                <Text style={styles.cardCount}>
                                    {category.count} items
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </ScrollView>

            {/* Bottom Navigation */}
            <BottomBar />

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

    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 16,
    },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: bg.secondary,
        borderRadius: 8,
        paddingHorizontal: 10,
        flex: 1,
        marginRight: 10,
    },

    searchInput: {
        flex: 1,
        color: "#fff",
        paddingVertical: 10,
        marginLeft: 6,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },

    card: {
        width: "48%",
        backgroundColor: bg.secondary,
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        alignItems: "center",
    },

    cardTitle: {
        color: "#fff",
        fontWeight: "600",
        marginTop: 8,
    },

    cardCount: {
        color: "#aaa",
        fontSize: 12,
    },

    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: bg.secondary,
        paddingVertical: 12,
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