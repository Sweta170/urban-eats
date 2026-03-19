import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, ScrollView, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert, TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../utils/axiosInstance';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme, COLORS } from '../../context/ThemeContext';

export default function FoodDetailsScreen({ route, navigation }) {
    const { food: initialFood } = route.params;
    const { theme } = useTheme();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [food, setFood] = useState(initialFood);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [quantity, setQuantity] = useState(1);
    const [isFav, setIsFav] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await axiosInstance.get(`/api/review/${food._id}`);
            setReviews(res.data?.reviews || res.data || []);
        } catch (e) { }
    };

    const handleAddToCart = () => {
        addToCart(food, quantity);
        Alert.alert('Added to Cart', `${quantity}x ${food.name} added!`);
    };

    const submitReview = async () => {
        if (!reviewText.trim()) return;
        try {
            await axiosInstance.post('/api/review', { food: food._id, rating, comment: reviewText.trim() });
            setReviewText('');
            fetchReviews();
        } catch (e) {
            Alert.alert('Error', 'Failed to submit review.');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image */}
                <View>
                    <Image
                        source={{ uri: food.image || 'https://via.placeholder.com/400x250?text=Food' }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <TouchableOpacity style={styles.backFab} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.favFab} onPress={() => setIsFav(!isFav)}>
                        <Feather name="heart" size={20} color={isFav ? COLORS.primary : '#fff'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.body}>
                    {/* Title & Price */}
                    <View style={styles.row}>
                        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>{food.name}</Text>
                        <Text style={styles.price}>₹{food.price}</Text>
                    </View>

                    {food.restaurant && (
                        <Text style={[styles.restaurant, { color: theme.subtext }]}>
                            🍽️ {food.restaurant?.name || food.restaurant}
                        </Text>
                    )}

                    <Text style={[styles.desc, { color: theme.subtext }]}>
                        {food.description || 'A delicious dish crafted with the finest ingredients.'}
                    </Text>

                    {/* Quantity Selector */}
                    <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quantity</Text>
                        <View style={styles.qtyRow}>
                            <TouchableOpacity
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                style={[styles.qtyBtn, { borderColor: theme.border }]}
                            >
                                <Feather name="minus" size={18} color={theme.text} />
                            </TouchableOpacity>
                            <Text style={[styles.qty, { color: theme.text }]}>{quantity}</Text>
                            <TouchableOpacity
                                onPress={() => setQuantity(quantity + 1)}
                                style={[styles.qtyBtn, { borderColor: theme.border }]}
                            >
                                <Feather name="plus" size={18} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Reviews */}
                    <Text style={[styles.reviewTitle, { color: theme.text }]}>Reviews ({reviews.length})</Text>

                    {reviews.slice(0, 3).map((r, i) => (
                        <View key={i} style={[styles.reviewCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <View style={styles.reviewHeader}>
                                <Text style={[styles.reviewUser, { color: theme.text }]}>{r.user?.name || 'User'}</Text>
                                <View style={styles.stars}>
                                    {[...Array(5)].map((_, j) => (
                                        <Feather key={j} name="star" size={12} color={j < r.rating ? '#F6C90E' : theme.border} />
                                    ))}
                                </View>
                            </View>
                            <Text style={[styles.reviewText, { color: theme.subtext }]}>{r.comment}</Text>
                        </View>
                    ))}

                    {/* Add Review */}
                    <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Leave a Review</Text>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                                    <Feather name="star" size={24} color={s <= rating ? '#F6C90E' : theme.border} style={{ marginRight: 4 }} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            style={[styles.reviewInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.inputBg }]}
                            placeholder="Share your experience..."
                            placeholderTextColor={theme.subtext}
                            value={reviewText}
                            onChangeText={setReviewText}
                            multiline
                            numberOfLines={3}
                        />
                        <TouchableOpacity style={styles.reviewBtn} onPress={submitReview}>
                            <Text style={{ color: '#fff', fontWeight: '700' }}>Submit Review</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Add to Cart FAB */}
            <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                <View>
                    <Text style={[styles.footerLabel, { color: theme.subtext }]}>Total</Text>
                    <Text style={styles.total}>₹{(food.price * quantity).toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart} activeOpacity={0.85}>
                    <Feather name="shopping-cart" size={18} color="#fff" />
                    <Text style={styles.addBtnText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: { width: '100%', height: 280 },
    backFab: {
        position: 'absolute', top: 52, left: 16, width: 40, height: 40,
        borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
    },
    favFab: {
        position: 'absolute', top: 52, right: 16, width: 40, height: 40,
        borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
    },
    body: { padding: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    name: { fontSize: 22, fontWeight: '800', flex: 1, marginRight: 12 },
    price: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
    restaurant: { fontSize: 13, marginBottom: 12 },
    desc: { fontSize: 14, lineHeight: 22, marginBottom: 20 },
    section: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 20 },
    sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 14 },
    qtyRow: { flexDirection: 'row', alignItems: 'center' },
    qtyBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
    qty: { fontSize: 18, fontWeight: '700', marginHorizontal: 20 },
    reviewTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
    reviewCard: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 10 },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    reviewUser: { fontWeight: '700', fontSize: 13 },
    stars: { flexDirection: 'row' },
    reviewText: { fontSize: 13, lineHeight: 20 },
    starsRow: { flexDirection: 'row', marginBottom: 12 },
    reviewInput: { borderRadius: 10, borderWidth: 1.5, padding: 12, fontSize: 14, marginBottom: 12, minHeight: 80, textAlignVertical: 'top' },
    reviewBtn: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 12, alignItems: 'center' },
    footer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 20, borderTopWidth: 1,
    },
    footerLabel: { fontSize: 12, fontWeight: '600' },
    total: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
    addBtn: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary,
        borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24,
        shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 }, elevation: 8,
    },
    addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15, marginLeft: 8 },
});
