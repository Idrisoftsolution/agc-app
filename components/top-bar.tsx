import { bg } from '@/assets/css/css';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TopBar = ({ title, showBackButton = true }) => {
    const router = useRouter();

    return (
        <View style={styles.header}>
            {showBackButton ? (
                <TouchableOpacity onPress={() => router.back()}>
                    <ChevronLeft size={26} color={bg.tertiary} />
                </TouchableOpacity>
            ) : (
                <View style={{ width: 26 }} />
            )}

            <Text style={styles.headerTitle}>{title}</Text>

            <View style={{ width: 26 }} />
        </View>
    )
}

export default TopBar


const styles = StyleSheet.create({
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
})