import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../utils/axiosInstance';
import { useTheme, COLORS } from '../../context/ThemeContext';

export default function ChangePasswordScreen({ navigation }) {
    const { theme } = useTheme();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Missing Fields', 'Please fill in all fields.'); return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Mismatch', 'New passwords do not match.'); return;
        }
        if (newPassword.length < 6) {
            Alert.alert('Too Short', 'Password must be at least 6 characters.'); return;
        }
        try {
            setLoading(true);
            await axiosInstance.put('/api/auth/change-password', { currentPassword, newPassword });
            Alert.alert('Success', 'Password changed successfully.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        } catch (err) {
            Alert.alert('Error', err?.response?.data?.message || 'Incorrect current password.');
        } finally {
            setLoading(false);
        }
    };

    const PasswordInput = ({ label, value, setter, show, toggleShow }) => (
        <View>
            <Text style={[styles.label, { color: theme.subtext }]}>{label}</Text>
            <View style={[styles.inputWrap, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Feather name="lock" size={17} color={theme.subtext} style={{ marginRight: 10 }} />
                <TextInput
                    style={[styles.input, { color: theme.text }]}
                    secureTextEntry={!show}
                    value={value}
                    onChangeText={setter}
                    placeholder="••••••••"
                    placeholderTextColor={theme.subtext}
                />
                <TouchableOpacity onPress={toggleShow} style={{ padding: 6 }}>
                    <Feather name={show ? 'eye-off' : 'eye'} size={17} color={theme.subtext} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView style={[styles.flex, { backgroundColor: theme.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={22} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.iconWrap}>
                    <Feather name="shield" size={32} color={COLORS.primary} />
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Change Password</Text>
                <Text style={[styles.sub, { color: theme.subtext }]}>Keep your account secure with a strong password.</Text>

                <PasswordInput label="Current Password" value={currentPassword} setter={setCurrentPassword} show={showCurrent} toggleShow={() => setShowCurrent(!showCurrent)} />
                <PasswordInput label="New Password" value={newPassword} setter={setNewPassword} show={showNew} toggleShow={() => setShowNew(!showNew)} />
                <PasswordInput label="Confirm New Password" value={confirmPassword} setter={setConfirmPassword} show={showNew} toggleShow={() => setShowNew(!showNew)} />

                <TouchableOpacity style={[styles.btn, loading && { opacity: 0.7 }]} onPress={handleChange} disabled={loading} activeOpacity={0.85}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Update Password</Text>}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { padding: 24, paddingTop: 56 },
    backBtn: { marginBottom: 24, alignSelf: 'flex-start' },
    iconWrap: { width: 68, height: 68, borderRadius: 18, backgroundColor: '#FF6B3518', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 26, fontWeight: '800', marginBottom: 8 },
    sub: { fontSize: 14, lineHeight: 22, marginBottom: 28 },
    label: { fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1.5, marginBottom: 18, paddingHorizontal: 14 },
    input: { flex: 1, height: 50, fontSize: 15 },
    btn: {
        backgroundColor: COLORS.primary, borderRadius: 14, height: 54, justifyContent: 'center', alignItems: 'center', marginTop: 12,
        shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 8,
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
