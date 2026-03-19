import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, TextInput, TouchableOpacity,
    StyleSheet, Image, ActivityIndicator, RefreshControl, ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../utils/axiosInstance';
import { useCart } from '../../context/CartContext';
import { useTheme, COLORS } from '../../context/ThemeContext';

export default function MenuScreen({ navigation }) {
    const { theme } = useTheme();
    const { addToCart } = useCart();
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [foodRes, catRes] = await Promise.all([
                axiosInstance.get('/api/food'),
                axiosInstance.get('/api/category'),
            ]);
            setFoods(foodRes.data?.foods || foodRes.data || []);
            setCategories(catRes.data?.categories || catRes.data || []);
        } catch (e) {
            console.error('Menu fetch error', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const filtered = foods.filter((f) => {
        const matchCat = selectedCategory === 'All' || f.category === selectedCategory || f.category?.name === selectedCategory;
        const matchSearch = f.name?.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>🍔 Urban Eats</Text>
                <Text style={[styles.headerSub, { color: theme.subtext }]}>What are you craving?</Text>
            </View>

            {/* Search */}
            <View style={[styles.searchWrap, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Feather name="search" size={17} color={theme.subtext} style={{ marginRight: 10 }} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Search food..."
                    placeholderTextColor={theme.subtext}
                    value={search}
                    onChangeText={setSearch}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Feather name="x" size={16} color={theme.subtext} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Category Filter */}
            <ScrollView
                horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.catScroll}
            >
                {['All', ...categories.map((c) => c.name || c)].map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => setSelectedCategory(cat)}
                        style={[
                            styles.catChip,
                            { backgroundColor: selectedCategory === cat ? COLORS.primary : theme.card, borderColor: selectedCategory === cat ? COLORS.primary : theme.border },
                        ]}
                        activeOpacity={0.8}
                    >
                        <Text style={{ color: selectedCategory === cat ? '#fff' : theme.subtext, fontWeight: '600', fontSize: 13 }}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Food Grid */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={COLORS.primary} />}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Feather name="inbox" size={48} color={theme.subtext} />
                        <Text style={[styles.emptyText, { color: theme.subtext }]}>No items found</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
                        onPress={() => navigation.navigate('FoodDetails', { food: item })}
                        activeOpacity={0.85}
                    >
                        <Image
                            source={{ uri: item.image || 'https://via.placeholder.com/200x140?text=Food' }}
                            style={styles.cardImg}
                            resizeMode="cover"
                        />
                        <View style={styles.cardBody}>
                            <Text style={[styles.cardName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                            <Text style={[styles.cardPrice, { color: COLORS.primary }]}>₹{item.price}</Text>
                            <TouchableOpacity
                                style={styles.addBtn}
                                onPress={() => addToCart(item)}
                                activeOpacity={0.85}
                            >
                                <Feather name="plus" size={14} color="#fff" />
                                <Text style={styles.addBtnText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
    header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 22, fontWeight: '800' },
    headerSub: { fontSize: 13, marginTop: 2 },
    searchWrap: {
        flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 12,
        borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, height: 46,
    },
    searchInput: { flex: 1, fontSize: 15 },
    catScroll: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
    catChip: {
        paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
        borderWidth: 1.5, marginRight: 8,
    },
    list: { paddingHorizontal: 12, paddingBottom: 100 },
    card: {
        flex: 1, margin: 6, borderRadius: 16, borderWidth: 1,
        overflow: 'hidden',
    },
    cardImg: { width: '100%', height: 120 },
    cardBody: { padding: 12 },
    cardName: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
    cardPrice: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
    addBtn: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary,
        borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start',
    },
    addBtnText: { color: '#fff', fontWeight: '700', fontSize: 12, marginLeft: 4 },
    emptyText: { marginTop: 12, fontSize: 15 },
});
