import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet,
    Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useTheme, COLORS } from '../../context/ThemeContext';

const ORDER_STATUSES = ['Pending', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered'];

export default function RestaurantDashboardScreen() {
    const { logout, user } = useAuth();
    const { theme } = useTheme();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('orders'); // orders | menu

    const fetchOrders = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/api/order/restaurant');
            setOrders(res.data?.orders || res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axiosInstance.put(`/api/order/${orderId}/status`, { status: newStatus });
            setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (e) {
            Alert.alert('Error', 'Failed to update order status.');
        }
    };

    const STATUS_NEXT = {
        Pending: 'Accepted', Accepted: 'Preparing', Preparing: 'Out for Delivery', 'Out for Delivery': 'Delivered',
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
                <View>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Restaurant HQ</Text>
                    <Text style={[styles.headerSub, { color: theme.subtext }]}>{user?.name}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Feather name="log-out" size={20} color="#E53E3E" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={[styles.tabBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                {['orders'].map((t) => (
                    <TouchableOpacity
                        key={t}
                        onPress={() => setTab(t)}
                        style={[styles.tabBtn, tab === t && { borderBottomColor: COLORS.primary, borderBottomWidth: 2 }]}
                    >
                        <Text style={[styles.tabLabel, { color: tab === t ? COLORS.primary : theme.subtext }]}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(i) => i._id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Feather name="inbox" size={48} color={theme.subtext} />
                            <Text style={[styles.emptyText, { color: theme.subtext }]}>No orders yet</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <View style={styles.cardTop}>
                                <Text style={[styles.orderId, { color: theme.text }]}>#{item._id?.slice(-6).toUpperCase()}</Text>
                                <View style={[styles.badge, { backgroundColor: '#FF6B3520' }]}>
                                    <Text style={[styles.badgeText, { color: COLORS.primary }]}>{item.status}</Text>
                                </View>
                            </View>
                            <Text style={[styles.customer, { color: theme.subtext }]}>{item.user?.name || 'Customer'}</Text>
                            <Text style={[styles.items, { color: theme.subtext }]} numberOfLines={2}>
                                {item.items?.map((i) => `${i.food?.name || 'Item'} ×${i.quantity}`).join(', ')}
                            </Text>
                            <View style={styles.cardBottom}>
                                <Text style={styles.total}>₹{item.totalAmount?.toFixed(2)}</Text>
                                {STATUS_NEXT[item.status] && (
                                    <TouchableOpacity
                                        style={styles.nextBtn}
                                        onPress={() => updateStatus(item._id, STATUS_NEXT[item.status])}
                                    >
                                        <Feather name="arrow-right" size={14} color="#fff" />
                                        <Text style={styles.nextBtnText}>{STATUS_NEXT[item.status]}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 20, fontWeight: '800' },
    headerSub: { fontSize: 13, marginTop: 2 },
    logoutBtn: { padding: 8 },
    tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
    tabBtn: { flex: 1, paddingVertical: 14, alignItems: 'center' },
    tabLabel: { fontWeight: '700', fontSize: 14 },
    list: { padding: 16 },
    card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    orderId: { fontWeight: '800', fontSize: 15 },
    badge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
    badgeText: { fontWeight: '700', fontSize: 12 },
    customer: { fontSize: 13, marginBottom: 4 },
    items: { fontSize: 12, marginBottom: 12 },
    cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    total: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
    nextBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
    nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 13, marginLeft: 6 },
    emptyText: { marginTop: 12, fontSize: 15 },
});
