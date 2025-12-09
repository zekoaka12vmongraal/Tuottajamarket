import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Lisää tuote (jos sama id, kasvata qty)
  const addItem = (product) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].qty = (copy[idx].qty || 1) + 1;
        return copy;
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const changeQty = (id, qty) => {
    setItems(prev => {
      const copy = prev.map(i => ({ ...i }));
      const idx = copy.findIndex(i => i.id === id);
      if (idx === -1) return prev;
      copy[idx].qty = Math.max(0, qty);
      // poista jos nolla
      return copy.filter(i => i.qty > 0);
    });
  };

  const clearCart = () => setItems([]);

  // voitaisiin tallentaa localStorageen
  useEffect(() => {
    // esim. load/save jos haluat: localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      changeQty,
      clearCart,
      cartOpen,
      setCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
