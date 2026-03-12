import { bg } from '@/assets/css/css';
import { useRouter } from 'expo-router';
import { ScanLine, ShoppingBag, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const BottomBar = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    
    return (
        <View style={[styles.bottomNav]}>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push("/catalog")}
            >
                <ShoppingBag size={22} color={bg.tertiary} />
                <Text style={styles.navText}>Catalog</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.scanButton}
                onPress={() => router.push("/scanner")}
            >
                <ScanLine size={30} color="#fff" />

            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push("/account")}
            >
                <User size={22} color={bg.tertiary} />
                <Text style={styles.navText}>Account</Text>
            </TouchableOpacity>

        </View>
    )
}

export default BottomBar


const styles = StyleSheet.create({
    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems:"center",
        borderTopWidth: 1,
        borderColor: bg.tertiary,
        backgroundColor: "#1C1D21",
        paddingTop: 10,
        paddingBottom: 10,
    },

    navItem: {
        alignItems: "center",
    },

    navText: {
        color: "#fff",
        fontSize: 12,
    },

    scanButton: {
        backgroundColor: bg.tertiary,
        padding: 16,
        borderRadius: 40,
    },
})