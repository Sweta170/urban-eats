import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../utils/axiosInstance';
import { useCart } from '../../context/CartContext';
import { useTheme, COLORS } from '../../context/ThemeContext';

export default function CheckoutScreen({ navigation }) {
    const { theme } = useTheme();
    const { cartItems, cartTotal, clearCart } = useCart();
    const [address, setAddress] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponMsg, setCouponMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    const deliveryFee = 40;
    const grandTotal = (cartTotal + deliveryFee - discount).toFixed(2);

    const validateCoupon = async () => {
        if (!couponCode.trim()) return;
        try {
            setValidatingCoupon(true);
            const res = await axiosInstance.post('/api/coupons/validate', {
                code: couponCode.trim().toUpperCase(),
                orderTotal: cartTotal,
            });
            const disc = res.data?.discount || 0;
            setDiscount(disc);
            setCouponMsg(`✅ Coupon applied! You saved ₹${disc}`);
        } catch (err) {
            setDiscount(0);
            setCouponMsg('❌ ' + (err?.response?.data?.message || 'Invalid coupon code'));
        } finally {
            setValidatingCoupon(false);
        }
    };

    const placeOrder = async () => {
        if (!address.trim()) {
            Alert.alert('Address Required', 'Please enter your delivery address.');
            return;
        }
        if (cartItems.length === 0) {
            Alert.alert('Empty Cart', 'Add items to your cart first.');
            return;
        }
        try {
            setLoading(true);
            const res = await axiosInstance.post('/api/order', {
                items: cartItems.map((i) => ({ food: i._id, quantity: i.quantity })),
                totalAmount: parseFloat(grandTotal),
                deliveryAddress: address,
                discount,
                couponCode: discount > 0 ? couponCode : undefined,
            });
            const order = res.data?.order || res.data;
            clearCart();
            navigation.navigate('OrderSuccess', { orderId: order._id });
        } catch (err) {
            Alert.alert('Order Failed', err?.response?.data?.message || 'Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.flex, { backgroundColor: theme.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={22} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Checkout</Text>
                    <View style={{ width: 22 }} />
                </View>

                {/* Delivery Address */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>📍 Delivery Address</Text>
                <TextInput
                    style={[styles.textarea, { color: theme.text, borderColor: theme.border, backgroundColor: theme.inputBg }]}
                    placeholder="Enter your full delivery address..."
                    placeholderTextColor={theme.subtext}
                    value={address}
                    onChangeText={setAddress}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                />

                {/* Coupon */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>🏷️ Coupon Code</Text>
                <View style={styles.couponRow}>
                    <TextInput
                        style={[styles.couponInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.inputBg }]}
                        placeholder="Enter code (e.g. SAVE20)"
                        placeholderTextColor={theme.subtext}
                        value={couponCode}
                        onChangeText={(t) => { setCouponCode(t); setCouponMsg(''); setDiscount(0); }}
                        autoCapitalize="characters"
                    />
                    <TouchableOpacity
                        style={[styles.couponBtn, validatingCoupon && { opacity: 0.7 }]}
                        onPress={validateCoupon}
                        disabled={validatingCoupon}
                    >
                        {validatingCoupon ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>Apply</Text>}
                    </TouchableOpacity>
                </View>
                {couponMsg ? <Text style={[styles.couponMsg, { color: discount > 0 ? '#38A169' : '#E53E3E' }]}>{couponMsg}</Text> : null}

                {/* Order Summary */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>🧾 Order Summary</Text>
                <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    {cartItems.map((item) => (
                        <View key={item._id} style={styles.summaryRow}>
                            <Text style={[styles.summaryName, { color: theme.text }]} numberOfLines={1}>
                                {item.name} × {item.quantity}
                            </Text>
                            <Text style={[styles.summaryPrice, { color: theme.text }]}>₹{(item.price * item.quantity).toFixed(0)}</Text>
                        </View>
                    ))}
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryName, { color: theme.subtext }]}>Delivery Fee</Text>
                        <Text style={[styles.summaryPrice, { color: theme.subtext }]}>₹{deliveryFee}</Text>
                    </View>
                    {discount > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryName, { color: '#38A169' }]}>Discount</Text>
                            <Text style={[styles.summaryPrice, { color: '#38A169' }]}>-₹{discount}</Text>
                        </View>
                    )}
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <View style={styles.summaryRow}>
                        <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
                        <Text style={styles.totalVal}>₹{grandTotal}</Text>
                    </View>
                </View>

                {/* Place Order */}
                <TouchableOpacity
                    style={[styles.orderBtn, loading && { opacity: 0.7 }]}
                    onPress={placeOrder}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Feather name="check-circle" size={20} color="#fff" />
                            <Text style={styles.orderBtnText}>Place Order — ₹{grandTotal}</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { padding: 20, paddingTop: 56, paddingBottom: 40 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
    headerTitle: { fontSize: 20, fontWeight: '800' },
    sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
    textarea: { borderWidth: 1.5, borderRadius: 14, padding: 14, fontSize: 14, minHeight: 90, marginBottom: 20 },
    couponRow: { flexDirection: 'row', marginBottom: 8 },
    couponInput: { flex: 1, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 46, fontSize: 14, marginRight: 10 },
    couponBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 18, justifyContent: 'center' },
    couponMsg: { fontSize: 13, fontWeight: '600', marginBottom: 20 },
    summaryCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 24 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryName: { fontSize: 14, flex: 1, marginRight: 8 },
    summaryPrice: { fontSize: 14, fontWeight: '600' },
    divider: { height: 1, marginVertical: 10 },
    totalLabel: { fontSize: 16, fontWeight: '700' },
    totalVal: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
    orderBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.primary, borderRadius: 16, height: 58,
        shadowColor: COLORS.primary, shadowOpacity: 0.4,
        shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 10,
    },
    orderBtnText: { color: '#fff', fontWeight: '800', fontSize: 16, marginLeft: 10 },
});
