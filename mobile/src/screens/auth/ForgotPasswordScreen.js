import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../utils/axiosInstance';
import { useTheme, COLORS } from '../../context/ThemeContext';

export default function ForgotPasswordScreen({ navigation }) {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async () => {
        if (!email) { Alert.alert('Required', 'Please enter your email.'); return; }
        try {
            setLoading(true);
            await axiosInstance.post('/api/auth/forgot-password', { email: email.trim().toLowerCase() });
            setSent(true);
        } catch (err) {
            Alert.alert('Error', err?.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.flex, { backgroundColor: theme.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={22} color={theme.text} />
                </TouchableOpacity>

                <View style={styles.iconWrap}>
                    <Feather name="mail" size={32} color={COLORS.primary} />
                </View>

                <Text style={[styles.title, { color: theme.text }]}>Forgot Password?</Text>
                <Text style={[styles.sub, { color: theme.subtext }]}>
                    {sent
                        ? "We've sent a reset link to your email. Check your inbox!"
                        : "Enter your email and we'll send you a reset link."}
                </Text>

                {!sent && (
                    <>
                        <Text style={[styles.label, { color: theme.subtext }]}>Email Address</Text>
                        <View style={[styles.inputWrap, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                            <Feather name="mail" size={17} color={theme.subtext} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="you@example.com"
                                placeholderTextColor={theme.subtext}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.btn, loading && { opacity: 0.7 }]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send Reset Link</Text>}
                        </TouchableOpacity>
                    </>
                )}

                {sent && (
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
                        <Text style={styles.btnText}>Back to Sign In</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
                    <Feather name="arrow-left" size={14} color={COLORS.primary} />
                    <Text style={{ color: COLORS.primary, fontWeight: '600', marginLeft: 4 }}>Back to Sign In</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { padding: 24, paddingTop: 60 },
    backBtn: { marginBottom: 24, alignSelf: 'flex-start' },
    iconWrap: {
        width: 72, height: 72, borderRadius: 20, backgroundColor: '#FF6B3518',
        justifyContent: 'center', alignItems: 'center', marginBottom: 24,
    },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 10 },
    sub: { fontSize: 15, lineHeight: 23, marginBottom: 32 },
    label: { fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    inputWrap: {
        flexDirection: 'row', alignItems: 'center', borderRadius: 14,
        borderWidth: 1.5, marginBottom: 24, paddingHorizontal: 14,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, height: 50, fontSize: 15 },
    btn: {
        backgroundColor: COLORS.primary, borderRadius: 14, height: 54,
        justifyContent: 'center', alignItems: 'center', marginBottom: 20,
        shadowColor: COLORS.primary, shadowOpacity: 0.4,
        shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 8,
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    link: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
