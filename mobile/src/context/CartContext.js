import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (food, quantity = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i._id === food._id);
            if (existing) {
                return prev.map((i) =>
                    i._id === food._id ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            return [...prev, { ...food, quantity }];
        });
    };

    const removeFromCart = (foodId) => {
        setCartItems((prev) => prev.filter((i) => i._id !== foodId));
    };

    const updateQuantity = (foodId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(foodId);
            return;
        }
        setCartItems((prev) =>
            prev.map((i) => (i._id === foodId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, cartTotal, cartCount, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
