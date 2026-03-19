import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme, COLORS } from '../../context/ThemeContext';

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing Fields', 'Please enter your email and password.');
            return;
        }
        try {
            setLoading(true);
            await login(email.trim().toLowerCase(), password);
            // Navigation happens automatically via AppNavigator role check
        } catch (err) {
            Alert.alert('Login Failed', err?.response?.data?.message || 'Invalid credentials.');
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
                {/* Header */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={22} color={theme.text} />
                </TouchableOpacity>

                <Text style={[styles.title, { color: theme.text }]}>Welcome{'\n'}Back 👋</Text>
                <Text style={[styles.sub, { color: theme.subtext }]}>Sign in to continue ordering</Text>

                {/* Email */}
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

                {/* Password */}
                <Text style={[styles.label, { color: theme.subtext }]}>Password</Text>
                <View style={[styles.inputWrap, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                    <Feather name="lock" size={17} color={theme.subtext} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Your password"
                        placeholderTextColor={theme.subtext}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPass}
                    />
                    <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                        <Feather name={showPass ? 'eye-off' : 'eye'} size={17} color={theme.subtext} />
                    </TouchableOpacity>
                </View>

                {/* Forgot */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={styles.forgotWrap}
                >
                    <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 13 }}>
                        Forgot Password?
                    </Text>
                </TouchableOpacity>

                {/* Submit */}
                <TouchableOpacity
                    style={[styles.btn, loading && { opacity: 0.7 }]}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.btnText}>Sign In</Text>
                    )}
                </TouchableOpacity>

                {/* Register Link */}
                <View style={styles.row}>
                    <Text style={{ color: theme.subtext }}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { padding: 24, paddingTop: 60 },
    backBtn: { marginBottom: 24, alignSelf: 'flex-start' },
    title: { fontSize: 32, fontWeight: '800', lineHeight: 40, marginBottom: 8 },
    sub: { fontSize: 15, marginBottom: 32 },
    label: { fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    inputWrap: {
        flexDirection: 'row', alignItems: 'center', borderRadius: 14,
        borderWidth: 1.5, marginBottom: 18, paddingHorizontal: 14,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, height: 50, fontSize: 15 },
    eyeBtn: { padding: 6 },
    forgotWrap: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -10 },
    btn: {
        backgroundColor: COLORS.primary, borderRadius: 14, height: 54,
        justifyContent: 'center', alignItems: 'center', marginBottom: 24,
        shadowColor: COLORS.primary, shadowOpacity: 0.4,
        shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 8,
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    row: { flexDirection: 'row', justifyContent: 'center' },
});
