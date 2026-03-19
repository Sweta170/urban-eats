import React from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useTheme, COLORS } from '../../context/ThemeContext';

export default function CartScreen({ navigation }) {
    const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const { theme } = useTheme();

    if (cartItems.length === 0) {
        return (
            <View style={[styles.center, { backgroundColor: theme.background }]}>
                <Feather name="shopping-cart" size={64} color={theme.subtext} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>Your cart is empty</Text>
                <Text style={[styles.emptySub, { color: theme.subtext }]}>Add some delicious food!</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>My Cart</Text>
                <TouchableOpacity
                    onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Clear', style: 'destructive', onPress: clearCart },
                    ])}
                >
                    <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Clear All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={(i) => i._id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Image
                            source={{ uri: item.image || 'https://via.placeholder.com/80?text=Food' }}
                            style={styles.img}
                            resizeMode="cover"
                        />
                        <View style={styles.info}>
                            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                            <Text style={[styles.price, { color: COLORS.primary }]}>₹{item.price}</Text>
                            <View style={styles.qtyRow}>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item._id, item.quantity - 1)}
                                    style={[styles.qtyBtn, { borderColor: theme.border }]}
                                >
                                    <Feather name="minus" size={14} color={theme.text} />
                                </TouchableOpacity>
                                <Text style={[styles.qty, { color: theme.text }]}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item._id, item.quantity + 1)}
                                    style={[styles.qtyBtn, { borderColor: theme.border }]}
                                >
                                    <Feather name="plus" size={14} color={theme.text} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.right}>
                            <Text style={[styles.total, { color: theme.text }]}>₹{(item.price * item.quantity).toFixed(0)}</Text>
                            <TouchableOpacity onPress={() => removeFromCart(item._id)} style={styles.delBtn}>
                                <Feather name="trash-2" size={16} color="#E53E3E" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Footer */}
            <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.subtext }]}>Subtotal</Text>
                    <Text style={[styles.summaryVal, { color: theme.text }]}>₹{cartTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.subtext }]}>Delivery Fee</Text>
                    <Text style={[styles.summaryVal, { color: theme.text }]}>₹40.00</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <View style={styles.summaryRow}>
                    <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
                    <Text style={styles.totalVal}>₹{(cartTotal + 40).toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => navigation.navigate('Checkout')}
                    activeOpacity={0.85}
                >
                    <Feather name="credit-card" size={18} color="#fff" />
                    <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 16 },
    emptySub: { fontSize: 14, marginTop: 6 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 22, fontWeight: '800' },
    list: { padding: 16 },
    card: {
        flexDirection: 'row', borderRadius: 16, borderWidth: 1,
        padding: 12, marginBottom: 12, alignItems: 'center',
    },
    img: { width: 72, height: 72, borderRadius: 12, marginRight: 12 },
    info: { flex: 1 },
    name: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
    price: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
    qtyRow: { flexDirection: 'row', alignItems: 'center' },
    qtyBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
    qty: { fontSize: 15, fontWeight: '700', marginHorizontal: 12 },
    right: { alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 72 },
    total: { fontSize: 15, fontWeight: '800' },
    delBtn: { padding: 4 },
    footer: { padding: 20, borderTopWidth: 1 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryLabel: { fontSize: 14 },
    summaryVal: { fontSize: 14, fontWeight: '600' },
    divider: { height: 1, marginVertical: 10 },
    totalLabel: { fontSize: 16, fontWeight: '700' },
    totalVal: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
    checkoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.primary, borderRadius: 14, height: 54, marginTop: 16,
        shadowColor: COLORS.primary, shadowOpacity: 0.4,
        shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 8,
    },
    checkoutText: { color: '#fff', fontWeight: '700', fontSize: 16, marginLeft: 8 },
});
