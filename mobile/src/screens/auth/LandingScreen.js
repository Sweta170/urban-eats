import React, { useRef } from 'react';
import {
    View, Text, StyleSheet, Dimensions, ScrollView,
    TouchableOpacity, Image, Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, COLORS } from '../../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const FEATURES = [
    { icon: 'zap', title: 'Lightning Fast', desc: 'Food delivered to your door in minutes' },
    { icon: 'star', title: 'Top Restaurants', desc: 'Curated from the best local spots' },
    { icon: 'map-pin', title: 'Live Tracking', desc: 'Real-time order updates every step' },
    { icon: 'tag', title: 'Best Deals', desc: 'Exclusive coupons and promo offers' },
];

export default function LandingScreen({ navigation }) {
    const { theme, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* ── Hero Section ── */}
            <View style={styles.hero}>
                <View style={styles.heroBadge}>
                    <Feather name="trending-up" size={14} color={COLORS.primary} />
                    <Text style={styles.heroBadgeText}>#1 Food Delivery App</Text>
                </View>

                <Text style={[styles.heroTitle, { color: theme.text }]}>
                    Hungry? {'\n'}
                    <Text style={{ color: COLORS.primary }}>We've Got You</Text>
                    {'\n'}Covered.
                </Text>

                <Text style={[styles.heroSub, { color: theme.subtext }]}>
                    Order from your favourite restaurants and track your food in real-time.
                </Text>

                {/* CTA Buttons */}
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => navigation.navigate('Register')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.primaryBtnText}>Get Started — It's Free</Text>
                    <Feather name="arrow-right" size={18} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryBtn, { borderColor: theme.border }]}
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.85}
                >
                    <Text style={[styles.secondaryBtnText, { color: theme.text }]}>
                        Sign In to Your Account
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ── Divider ── */}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* ── Features ── */}
            <View style={styles.featuresGrid}>
                {FEATURES.map((f) => (
                    <View key={f.icon} style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <View style={styles.featureIconWrap}>
                            <Feather name={f.icon} size={20} color={COLORS.primary} />
                        </View>
                        <Text style={[styles.featureTitle, { color: theme.text }]}>{f.title}</Text>
                        <Text style={[styles.featureDesc, { color: theme.subtext }]}>{f.desc}</Text>
                    </View>
                ))}
            </View>

            {/* ── Footer ── */}
            <Text style={[styles.footer, { color: theme.subtext }]}>
                Join 10,000+ happy customers today
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24, paddingTop: 64, paddingBottom: 32 },

    hero: { marginBottom: 28 },
    heroBadge: {
        flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
        backgroundColor: '#FF6B3520', borderRadius: 20, paddingHorizontal: 12,
        paddingVertical: 5, marginBottom: 20,
    },
    heroBadgeText: { color: COLORS.primary, fontSize: 12, fontWeight: '700', marginLeft: 6 },

    heroTitle: { fontSize: 38, fontWeight: '800', lineHeight: 46, marginBottom: 14 },
    heroSub: { fontSize: 15, lineHeight: 23, marginBottom: 28 },

    primaryBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16,
        marginBottom: 12, shadowColor: COLORS.primary, shadowOpacity: 0.4,
        shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8,
    },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    secondaryBtn: {
        borderRadius: 14, paddingVertical: 15, borderWidth: 1.5,
        alignItems: 'center', marginBottom: 4,
    },
    secondaryBtnText: { fontSize: 15, fontWeight: '600' },

    divider: { height: 1, marginBottom: 24 },

    featuresGrid: {
        flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12,
    },
    featureCard: {
        width: '47%', borderRadius: 16, borderWidth: 1,
        padding: 16, marginBottom: 4,
    },
    featureIconWrap: {
        backgroundColor: '#FF6B3518', borderRadius: 10,
        width: 38, height: 38, justifyContent: 'center', alignItems: 'center', marginBottom: 10,
    },
    featureTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
    featureDesc: { fontSize: 11, lineHeight: 16 },

    footer: { textAlign: 'center', fontSize: 12, marginTop: 24 },
});
