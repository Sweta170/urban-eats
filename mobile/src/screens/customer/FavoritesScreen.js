import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet,
    Image, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../utils/axiosInstance';
import { useCart } from '../../context/CartContext';
import { useTheme, COLORS } from '../../context/ThemeContext';

export default function FavoritesScreen({ navigation }) {
    const { theme } = useTheme();
    const { addToCart } = useCart();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFavorites = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/api/favorite');
            setFavorites(res.data?.favorites || res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); setRefreshing(false); }
    }, []);

    useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

    const removeFavorite = async (foodId) => {
        try {
            await axiosInstance.delete(`/api/favorite/${foodId}`);
            setFavorites((prev) => prev.filter((f) => (f.food?._id || f._id) !== foodId));
        } catch (e) { console.error(e); }
    };

    if (loading) return <View style={[styles.center, { backgroundColor: theme.background }]}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>❤️ Favorites</Text>
            </View>

            <FlatList
                data={favorites}
                keyExtractor={(i) => i._id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchFavorites(); }} tintColor={COLORS.primary} />}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Feather name="heart" size={56} color={theme.subtext} />
                        <Text style={[styles.emptyText, { color: theme.subtext }]}>No favorites yet</Text>
                        <Text style={[styles.emptySub, { color: theme.subtext }]}>Tap the heart icon on any food item</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const food = item.food || item;
                    return (
                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
                            onPress={() => navigation.navigate('Menu', { screen: 'FoodDetails', params: { food } })}
                            activeOpacity={0.85}
                        >
                            <Image
                                source={{ uri: food.image || 'https://via.placeholder.com/80?text=Food' }}
                                style={styles.img}
                                resizeMode="cover"
                            />
                            <View style={styles.info}>
                                <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{food.name}</Text>
                                <Text style={[styles.price, { color: COLORS.primary }]}>₹{food.price}</Text>
                                <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(food)}>
                                    <Feather name="plus" size={13} color="#fff" />
                                    <Text style={styles.addBtnText}>Add to Cart</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => removeFavorite(food._id)} style={styles.heartBtn}>
                                <Feather name="heart" size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
    header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 22, fontWeight: '800' },
    list: { padding: 16 },
    card: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, padding: 12, marginBottom: 12, alignItems: 'center' },
    img: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    price: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
    addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start' },
    addBtnText: { color: '#fff', fontWeight: '700', fontSize: 12, marginLeft: 4 },
    heartBtn: { padding: 8 },
    emptyText: { fontSize: 16, fontWeight: '700', marginTop: 12 },
    emptySub: { fontSize: 13, marginTop: 4 },
});
