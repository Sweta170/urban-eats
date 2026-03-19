import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme, COLORS } from '../context/ThemeContext';

// Auth screens
import LandingScreen from '../screens/auth/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Customer screens
import MenuScreen from '../screens/customer/MenuScreen';
import FoodDetailsScreen from '../screens/customer/FoodDetailsScreen';
import CartScreen from '../screens/customer/CartScreen';
import CheckoutScreen from '../screens/customer/CheckoutScreen';
import OrderSuccessScreen from '../screens/customer/OrderSuccessScreen';
import OrderTrackingScreen from '../screens/customer/OrderTrackingScreen';
import OrdersScreen from '../screens/customer/OrdersScreen';
import FavoritesScreen from '../screens/customer/FavoritesScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import ChangePasswordScreen from '../screens/customer/ChangePasswordScreen';

// Dashboard screens
import RestaurantDashboardScreen from '../screens/restaurant/RestaurantDashboardScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Auth Stack ──────────────────────────────────────────────────────────────
function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
}

// ─── Customer Tab Navigator ──────────────────────────────────────────────────
function CustomerTabs() {
    const { theme } = useTheme();
    const { cartCount } = useCart();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.tabBar,
                    borderTopColor: theme.border,
                    borderTopWidth: 1,
                    paddingBottom: 6,
                    paddingTop: 6,
                    height: 62,
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: theme.subtext,
                tabBarIcon: ({ color, size }) => {
                    const icons = {
                        Menu: 'grid',
                        Cart: 'shopping-cart',
                        Orders: 'package',
                        Favorites: 'heart',
                        Profile: 'user',
                    };
                    return <Feather name={icons[route.name]} size={22} color={color} />;
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            })}
        >
            <Tab.Screen name="Menu" component={MenuStack} />
            <Tab.Screen
                name="Cart"
                component={CartStack}
                options={{
                    tabBarBadge: cartCount > 0 ? cartCount : undefined,
                    tabBarBadgeStyle: { backgroundColor: COLORS.primary, fontSize: 10 },
                }}
            />
            <Tab.Screen name="Orders" component={OrdersStack} />
            <Tab.Screen name="Favorites" component={FavoritesScreen} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}

// ─── Customer Sub-Stacks ─────────────────────────────────────────────────────
function MenuStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MenuMain" component={MenuScreen} />
            <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
        </Stack.Navigator>
    );
}

function CartStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CartMain" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
            <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        </Stack.Navigator>
    );
}

function OrdersStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="OrdersMain" component={OrdersScreen} />
            <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        </Stack.Navigator>
    );
}

function ProfileStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileMain" component={ProfileScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        </Stack.Navigator>
    );
}

// ─── Root Navigator ──────────────────────────────────────────────────────────
export default function AppNavigator() {
    const { token, role, loading } = useAuth();
    const { theme } = useTheme();

    if (loading) {
        return (
            <View style={[styles.loader, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!token) return <AuthStack />;
    if (role === 'restaurant') {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="RestaurantDashboard" component={RestaurantDashboardScreen} />
            </Stack.Navigator>
        );
    }
    if (role === 'admin') {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            </Stack.Navigator>
        );
    }
    return <CustomerTabs />;
}

const styles = StyleSheet.create({
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
