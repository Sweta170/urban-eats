import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../utils/axiosInstance';
import { getSocket } from '../../utils/socket';
import { useTheme, COLORS } from '../../context/ThemeContext';

const STATUS_STEPS = ['Pending', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered'];
const STATUS_ICONS = { Pending: 'clock', Accepted: 'check', Preparing: 'coffee', 'Out for Delivery': 'truck', Delivered: 'check-circle' };

export default function OrderTrackingScreen({ route, navigation }) {
    const { orderId } = route.params || {};
    const { theme } = useTheme();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
        const socket = getSocket();
        socket.emit('join-order', orderId);
        socket.on('order-status-updated', (data) => {
            if (data.orderId === orderId) {
                setOrder((prev) => prev ? { ...prev, status: data.status } : prev);
            }
        });
        return () => { socket.off('order-status-updated'); };
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const res = await axiosInstance.get(`/api/order/${orderId}`);
            setOrder(res.data?.order || res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={[styles.center, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Order not found.</Text>
            </View>
        );
    }

    const currentStep = STATUS_STEPS.indexOf(order.status);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Track Order</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Order ID */}
                <View style={[styles.idCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.idLabel, { color: theme.subtext }]}>Order ID</Text>
                    <Text style={[styles.id, { color: theme.text }]}>#{order._id?.slice(-8).toUpperCase()}</Text>
                </View>

                {/* Status Badge */}
                <View style={styles.statusBadge}>
                    <View style={[styles.badge, { backgroundColor: order.status === 'Delivered' ? '#38A16920' : '#FF6B3520' }]}>
                        <Feather name={STATUS_ICONS[order.status] || 'clock'} size={14} color={order.status === 'Delivered' ? '#38A169' : COLORS.primary} />
                        <Text style={[styles.badgeText, { color: order.status === 'Delivered' ? '#38A169' : COLORS.primary }]}>
                            {order.status}
                        </Text>
                    </View>
                </View>

                {/* Steps Timeline */}
                <View style={[styles.timelineCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Order Progress</Text>
                    {STATUS_STEPS.map((step, i) => {
                        const done = i <= currentStep;
                        const active = i === currentStep;
                        return (
                            <View key={step} style={styles.step}>
                                <View style={styles.stepLeft}>
                                    <View style={[styles.stepDot, {
                                        backgroundColor: done ? (active ? COLORS.primary : '#38A169') : theme.border,
                                        borderColor: done ? (active ? COLORS.primary : '#38A169') : theme.border,
                                    }]}>
                                        <Feather name={done ? 'check' : 'circle'} size={12} color={done ? '#fff' : theme.subtext} />
                                    </View>
                                    {i < STATUS_STEPS.length - 1 && (
                                        <View style={[styles.stepLine, { backgroundColor: i < currentStep ? '#38A169' : theme.border }]} />
                                    )}
                                </View>
                                <View style={styles.stepRight}>
                                    <Text style={[styles.stepLabel, { color: done ? theme.text : theme.subtext, fontWeight: done ? '700' : '500' }]}>{step}</Text>
                                    {active && <Text style={{ color: COLORS.primary, fontSize: 12 }}>Current Status</Text>}
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Order Items */}
                <View style={[styles.itemsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Items Ordered</Text>
                    {order.items?.map((item, i) => (
                        <View key={i} style={styles.itemRow}>
                            <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                                {item.food?.name || 'Item'} × {item.quantity}
                            </Text>
                            <Text style={[styles.itemPrice, { color: theme.subtext }]}>
                                ₹{((item.food?.price || 0) * item.quantity).toFixed(0)}
                            </Text>
                        </View>
                    ))}
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <View style={styles.itemRow}>
                        <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
                        <Text style={styles.totalVal}>₹{order.totalAmount?.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    content: { padding: 20 },
    idCard: { borderRadius: 14, borderWidth: 1, padding: 16, alignItems: 'center', marginBottom: 16 },
    idLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
    id: { fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
    statusBadge: { alignItems: 'center', marginBottom: 20 },
    badge: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
    badgeText: { fontWeight: '700', marginLeft: 6 },
    timelineCard: { borderRadius: 16, borderWidth: 1, padding: 20, marginBottom: 16 },
    sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 16 },
    step: { flexDirection: 'row', marginBottom: 0 },
    stepLeft: { alignItems: 'center', marginRight: 14 },
    stepDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
    stepLine: { width: 2, flex: 1, minHeight: 28, marginVertical: 2 },
    stepRight: { flex: 1, paddingBottom: 24 },
    stepLabel: { fontSize: 14 },
    itemsCard: { borderRadius: 16, borderWidth: 1, padding: 20, marginBottom: 24 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    itemName: { fontSize: 14, flex: 1, marginRight: 8 },
    itemPrice: { fontSize: 14, fontWeight: '600' },
    divider: { height: 1, marginVertical: 10 },
    totalLabel: { fontSize: 15, fontWeight: '700' },
    totalVal: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
});
