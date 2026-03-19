import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet,
    Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useTheme, COLORS } from '../../context/ThemeContext';

const TABS = ['Overview', 'Users', 'Orders', 'Coupons'];

export default function AdminDashboardScreen() {
    const { logout } = useAuth();
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('Overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [ordersRes, usersRes] = await Promise.all([
                axiosInstance.get('/api/order/all'),
                axiosInstance.get('/api/auth/users'),
            ]);
            const allOrders = ordersRes.data?.orders || ordersRes.data || [];
            const allUsers = usersRes.data?.users || usersRes.data || [];
            setOrders(allOrders);
            setUsers(allUsers);
            setStats({
                totalOrders: allOrders.length,
                totalUsers: allUsers.length,
                revenue: allOrders.reduce((s, o) => s + (o.totalAmount || 0), 0),
                delivered: allOrders.filter((o) => o.status === 'Delivered').length,
            });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const StatCard = ({ label, value, icon, color }) => (
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
                <Feather name={icon} size={20} color={color} />
            </View>
            <Text style={[styles.statVal, { color: theme.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>{label}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
                <View>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Admin Dashboard</Text>
                    <Text style={[styles.headerSub, { color: theme.subtext }]}>Urban Eats Control Panel</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Feather name="log-out" size={20} color="#E53E3E" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.tabScroll, { borderBottomColor: theme.border }]} contentContainerStyle={styles.tabContent}>
                {TABS.map((t) => (
                    <TouchableOpacity
                        key={t}
                        onPress={() => setActiveTab(t)}
                        style={[styles.tabBtn, activeTab === t && styles.tabActive]}
                    >
                        <Text style={[styles.tabLabel, { color: activeTab === t ? COLORS.primary : theme.subtext }]}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    {activeTab === 'Overview' && stats && (
                        <>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Platform Overview</Text>
                            <View style={styles.statsGrid}>
                                <StatCard label="Total Orders" value={stats.totalOrders} icon="package" color={COLORS.primary} />
                                <StatCard label="Total Users" value={stats.totalUsers} icon="users" color="#3182CE" />
                                <StatCard label="Revenue" value={`₹${stats.revenue.toFixed(0)}`} icon="trending-up" color="#38A169" />
                                <StatCard label="Delivered" value={stats.delivered} icon="check-circle" color="#805AD5" />
                            </View>
                        </>
                    )}

                    {activeTab === 'Users' && (
                        <>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>{users.length} Users</Text>
                            {users.map((u) => (
                                <View key={u._id} style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                    <View style={styles.userAvatar}>
                                        <Text style={styles.userAvatarText}>{(u.name || 'U')[0].toUpperCase()}</Text>
                                    </View>
                                    <View style={styles.userInfo}>
                                        <Text style={[styles.userName, { color: theme.text }]}>{u.name}</Text>
                                        <Text style={[styles.userEmail, { color: theme.subtext }]}>{u.email}</Text>
                                    </View>
                                    <View style={[styles.rolePill, { backgroundColor: '#FF6B3520' }]}>
                                        <Text style={{ color: COLORS.primary, fontSize: 11, fontWeight: '700' }}>{u.role}</Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    )}

                    {activeTab === 'Orders' && (
                        <>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>{orders.length} Orders</Text>
                            {orders.slice(0, 20).map((o) => (
                                <View key={o._id} style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                    <View style={styles.orderInfo}>
                                        <Text style={[styles.userName, { color: theme.text }]}>#{o._id?.slice(-6).toUpperCase()}</Text>
                                        <Text style={[styles.userEmail, { color: theme.subtext }]}>{o.user?.name} · ₹{o.totalAmount?.toFixed(0)}</Text>
                                    </View>
                                    <View style={[styles.rolePill, { backgroundColor: '#FF6B3520' }]}>
                                        <Text style={{ color: COLORS.primary, fontSize: 11, fontWeight: '700' }}>{o.status}</Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    )}

                    {activeTab === 'Coupons' && (
                        <View style={styles.center}>
                            <Feather name="tag" size={48} color={theme.subtext} />
                            <Text style={[styles.emptyText, { color: theme.subtext }]}>Coupon management{'\n'}coming soon</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 20, fontWeight: '800' },
    headerSub: { fontSize: 12, marginTop: 2 },
    logoutBtn: { padding: 8 },
    tabScroll: { borderBottomWidth: 1, maxHeight: 52 },
    tabContent: { paddingHorizontal: 16, flexDirection: 'row' },
    tabBtn: { paddingHorizontal: 16, paddingVertical: 14, marginRight: 4 },
    tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
    tabLabel: { fontWeight: '700', fontSize: 14 },
    content: { padding: 16, paddingBottom: 40 },
    sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 16 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    statCard: { width: '47%', borderRadius: 16, borderWidth: 1, padding: 16, alignItems: 'flex-start', marginBottom: 4 },
    statIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    statVal: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
    statLabel: { fontSize: 12 },
    rowCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
    userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    userAvatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
    userInfo: { flex: 1 },
    orderInfo: { flex: 1 },
    userName: { fontSize: 14, fontWeight: '700' },
    userEmail: { fontSize: 12, marginTop: 2 },
    rolePill: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
    emptyText: { textAlign: 'center', marginTop: 12, fontSize: 14, lineHeight: 22 },
});
