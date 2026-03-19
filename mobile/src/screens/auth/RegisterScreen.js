import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../utils/axiosInstance';
import { useTheme, COLORS } from '../../context/ThemeContext';

export default function RegisterScreen({ navigation }) {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            return;
        }
        try {
            setLoading(true);
            await axiosInstance.post('/api/auth/register', {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
            });
            Alert.alert('Account Created!', 'You can now sign in.', [
                { text: 'Sign In', onPress: () => navigation.navigate('Login') },
            ]);
        } catch (err) {
            Alert.alert('Registration Failed', err?.response?.data?.message || 'Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: 'Full Name', icon: 'user', value: name, setter: setName, placeholder: 'John Doe', type: 'default' },
        { label: 'Email Address', icon: 'mail', value: email, setter: setEmail, placeholder: 'you@example.com', type: 'email-address' },
    ];

    return (
        <KeyboardAvoidingView
            style={[styles.flex, { backgroundColor: theme.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={22} color={theme.text} />
                </TouchableOpacity>

                <Text style={[styles.title, { color: theme.text }]}>Create{'\n'}Account 🍔</Text>
                <Text style={[styles.sub, { color: theme.subtext }]}>Join thousands of happy customers</Text>

                {fields.map((f) => (
                    <View key={f.label}>
                        <Text style={[styles.label, { color: theme.subtext }]}>{f.label}</Text>
                        <View style={[styles.inputWrap, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                            <Feather name={f.icon} size={17} color={theme.subtext} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder={f.placeholder}
                                placeholderTextColor={theme.subtext}
                                value={f.value}
                                onChangeText={f.setter}
                                keyboardType={f.type}
                                autoCapitalize={f.type === 'email-address' ? 'none' : 'words'}
                            />
                        </View>
                    </View>
                ))}

                <Text style={[styles.label, { color: theme.subtext }]}>Password</Text>
                <View style={[styles.inputWrap, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                    <Feather name="lock" size={17} color={theme.subtext} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Min. 6 characters"
                        placeholderTextColor={theme.subtext}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPass}
                    />
                    <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                        <Feather name={showPass ? 'eye-off' : 'eye'} size={17} color={theme.subtext} />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.label, { color: theme.subtext }]}>Confirm Password</Text>
                <View style={[styles.inputWrap, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                    <Feather name="lock" size={17} color={theme.subtext} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Repeat your password"
                        placeholderTextColor={theme.subtext}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPass}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.btn, loading && { opacity: 0.7 }]}
                    onPress={handleRegister}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.btnText}>Create Account</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.row}>
                    <Text style={{ color: theme.subtext }}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Sign In</Text>
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
    btn: {
        backgroundColor: COLORS.primary, borderRadius: 14, height: 54,
        justifyContent: 'center', alignItems: 'center', marginBottom: 24, marginTop: 8,
        shadowColor: COLORS.primary, shadowOpacity: 0.4,
        shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 8,
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    row: { flexDirection: 'row', justifyContent: 'center' },
});
