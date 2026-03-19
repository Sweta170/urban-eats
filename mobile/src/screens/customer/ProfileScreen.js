import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useTheme, COLORS } from '../../context/ThemeContext';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();
    const { theme, isDark, toggleTheme } = useTheme();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const saveProfile = async () => {
        try {
            setSaving(true);
            await axiosInstance.put('/api/auth/profile', { name });
            Alert.alert('Saved', 'Profile updated successfully.');
            setEditing(false);
        } catch (e) {
            Alert.alert('Error', 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', style: 'destructive', onPress: logout },
        ]);
    };

    const MenuItem = ({ icon, label, onPress, danger }) => (
        <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.menuIcon, { backgroundColor: danger ? '#FED7D720' : '#FF6B3518' }]}>
                <Feather name={icon} size={18} color={danger ? '#E53E3E' : COLORS.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: danger ? '#E53E3E' : theme.text }]}>{label}</Text>
            {!danger && <Feather name="chevron-right" size={18} color={theme.subtext} />}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
                <TouchableOpacity onPress={() => setEditing(!editing)}>
                    <Feather name={editing ? 'x' : 'edit-2'} size={20} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View style={styles.avatarSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarInitial}>{(user?.name || 'U')[0].toUpperCase()}</Text>
                </View>
                <Text style={[styles.userName, { color: theme.text }]}>{user?.name}</Text>
                <View style={[styles.roleBadge, { backgroundColor: '#FF6B3520' }]}>
                    <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 12 }}>
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Customer'}
                    </Text>
                </View>
            </View>

            {/* Edit Form */}
            {editing && (
                <View style={[styles.editCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.subtext }]}>Display Name</Text>
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.inputBg }]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your name"
                        placeholderTextColor={theme.subtext}
                    />
                    <Text style={[styles.label, { color: theme.subtext }]}>Email (read-only)</Text>
                    <TextInput
                        style={[styles.input, { color: theme.subtext, borderColor: theme.border, backgroundColor: theme.inputBg }]}
                        value={email}
                        editable={false}
                    />
                    <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={saveProfile} disabled={saving}>
                        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
                    </TouchableOpacity>
                </View>
            )}

            {/* Menu */}
            <View style={[styles.menuCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.menuSection, { color: theme.subtext }]}>ACCOUNT</Text>
                <MenuItem icon="lock" label="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
                <MenuItem
                    icon={isDark ? 'sun' : 'moon'}
                    label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    onPress={toggleTheme}
                />
                <MenuItem icon="package" label="My Orders" onPress={() => navigation.navigate('Orders')} />
                <Text style={[styles.menuSection, { color: theme.subtext, marginTop: 16 }]}>APP</Text>
                <MenuItem icon="info" label="About Urban Eats" onPress={() => Alert.alert('Urban Eats', 'Version 1.0.0\nFast food delivery at your fingertips.')} />
                <MenuItem icon="log-out" label="Log Out" onPress={handleLogout} danger />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 22, fontWeight: '800' },
    avatarSection: { alignItems: 'center', paddingVertical: 28 },
    avatar: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary,
        justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    },
    avatarInitial: { color: '#fff', fontSize: 32, fontWeight: '800' },
    userName: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
    roleBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
    editCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
    label: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', marginBottom: 6 },
    input: { borderRadius: 10, borderWidth: 1.5, padding: 12, fontSize: 14, marginBottom: 14 },
    saveBtn: { backgroundColor: COLORS.primary, borderRadius: 12, height: 48, justifyContent: 'center', alignItems: 'center' },
    saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    menuCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, padding: 8, marginBottom: 40 },
    menuSection: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1 },
    menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    menuLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
});
