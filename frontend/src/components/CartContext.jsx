import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [lang, setLang] = useState("fi"); // fi / en
  const [cartOpen, setCartOpen] = useState(false);

  const addItem = (product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const changeQty = (id, qty) => {
    setItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, qty: Math.max(1, qty) } : i
      )
    );
  };

  const t = (fi, en) => (lang === "fi" ? fi : en);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      changeQty,
      cartOpen,
      setCartOpen,
      lang,
      setLang,
      t
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
