import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, COLORS } from '../../context/ThemeContext';

export default function OrderSuccessScreen({ route, navigation }) {
    const { orderId } = route.params || {};
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.iconWrap}>
                <Feather name="check-circle" size={72} color="#38A169" />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Order Placed!</Text>
            <Text style={[styles.sub, { color: theme.subtext }]}>
                Your order has been successfully placed and is being prepared.
            </Text>
            {orderId && (
                <View style={[styles.idCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.idLabel, { color: theme.subtext }]}>Order ID</Text>
                    <Text style={[styles.id, { color: theme.text }]}>#{orderId.slice(-8).toUpperCase()}</Text>
                </View>
            )}
            <TouchableOpacity
                style={styles.trackBtn}
                onPress={() => navigation.navigate('OrderTracking', { orderId })}
                activeOpacity={0.85}
            >
                <Feather name="map-pin" size={18} color="#fff" />
                <Text style={styles.trackBtnText}>Track My Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.menuBtn, { borderColor: theme.border }]}
                onPress={() => navigation.navigate('Menu')}
                activeOpacity={0.85}
            >
                <Text style={[styles.menuBtnText, { color: theme.text }]}>Browse More Food</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    iconWrap: {
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: '#38A16920', justifyContent: 'center', alignItems: 'center', marginBottom: 24,
    },
    title: { fontSize: 32, fontWeight: '800', marginBottom: 12 },
    sub: { fontSize: 15, lineHeight: 23, textAlign: 'center', marginBottom: 28 },
    idCard: { borderRadius: 14, borderWidth: 1, padding: 16, alignItems: 'center', marginBottom: 28, width: '100%' },
    idLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
    id: { fontSize: 18, fontWeight: '800', letterSpacing: 1 },
    trackBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.primary, borderRadius: 14, height: 54, width: '100%', marginBottom: 12,
        shadowColor: COLORS.primary, shadowOpacity: 0.4,
        shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 8,
    },
    trackBtnText: { color: '#fff', fontWeight: '700', fontSize: 16, marginLeft: 8 },
    menuBtn: { borderRadius: 14, borderWidth: 1.5, height: 52, width: '100%', justifyContent: 'center', alignItems: 'center' },
    menuBtnText: { fontSize: 15, fontWeight: '600' },
});
