import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet,
    ActivityIndicator, RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../utils/axiosInstance';
import { useTheme, COLORS } from '../../context/ThemeContext';

const STATUS_COLOR = {
    Pending: '#D69E2E',
    Accepted: '#3182CE',
    Preparing: '#DD6B20',
    'Out for Delivery': '#805AD5',
    Delivered: '#38A169',
};

export default function OrdersScreen({ navigation }) {
    const { theme } = useTheme();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/api/order');
            setOrders(res.data?.orders || res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); setRefreshing(false); }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>My Orders</Text>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(i) => i._id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOrders(); }} tintColor={COLORS.primary} />}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Feather name="package" size={56} color={theme.subtext} />
                        <Text style={[styles.emptyText, { color: theme.subtext }]}>No orders yet</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
                        onPress={() => navigation.navigate('OrderTracking', { orderId: item._id })}
                        activeOpacity={0.85}
                    >
                        <View style={styles.cardTop}>
                            <Text style={[styles.orderId, { color: theme.text }]}>
                                Order #{item._id?.slice(-6).toUpperCase()}
                            </Text>
                            <View style={[styles.badge, { backgroundColor: (STATUS_COLOR[item.status] || '#718096') + '20' }]}>
                                <Text style={[styles.badgeText, { color: STATUS_COLOR[item.status] || '#718096' }]}>{item.status}</Text>
                            </View>
                        </View>
                        <Text style={[styles.items, { color: theme.subtext }]} numberOfLines={1}>
                            {item.items?.map((i) => `${i.food?.name || 'Item'} ×${i.quantity}`).join(', ')}
                        </Text>
                        <View style={styles.cardBottom}>
                            <Text style={[styles.date, { color: theme.subtext }]}>
                                {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Text>
                            <Text style={styles.total}>₹{item.totalAmount?.toFixed(2)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
    header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 22, fontWeight: '800' },
    list: { padding: 16 },
    card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    orderId: { fontSize: 14, fontWeight: '700' },
    badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { fontSize: 12, fontWeight: '700' },
    items: { fontSize: 13, marginBottom: 12 },
    cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    date: { fontSize: 12 },
    total: { fontSize: 15, fontWeight: '800', color: COLORS.primary },
    emptyText: { marginTop: 12, fontSize: 15 },
});
