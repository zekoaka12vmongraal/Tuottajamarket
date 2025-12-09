import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../components/CartContext";
import { useLang } from "../components/LanguageContext";
import CartSidebar from "../components/CartSidebar";

export default function Store() {
  const { addItem, setCartOpen } = useCart();
  const { t, lang, toggleLang } = useLang();
  
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(0);

  // 🔥 OIKEA BACKEND-OSOITE RENDERISSÄ
  const API_URL = import.meta.env.VITE_API_URL || "";

  console.log("Backend URL =", API_URL);

  // HAE TUOTTEET BACKENDILTÄ
  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      
      if (!res.ok) throw new Error("Backend ei vastaa");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Tuotteiden lataus epäonnistui:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === 0 ? true : p.category_id === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* HAKU */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder={t("Hae tuotteita...", "Search products...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "15px"
          }}
        />

        {/* KATEGORIA */}
        <select
          value={category}
          onChange={(e) => setCategory(Number(e.target.value))}
          style={{ 
            padding: "12px", 
            marginLeft: "15px", 
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "15px"
          }}
        >
          <option value={0}>{t("Kaikki kategoriat", "All categories")}</option>
          <option value={1}>{t("Liha", "Meat")}</option>
          <option value={2}>{t("Kala", "Fish")}</option>
          <option value={3}>{t("Viljatuotteet", "Grains")}</option>
          <option value={4}>{t("Marjat", "Berries")}</option>
          <option value={5}>{t("Juustot", "Cheese")}</option>
          <option value={6}>{t("Muut tuotteet", "Other products")}</option>
        </select>

        <button
          onClick={() => setCartOpen(true)}
          style={{
            padding: "12px 24px",
            background: "#00a300",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginLeft: "15px",
            fontSize: "15px",
            fontWeight: "600"
          }}
        >
          🛒 {t("Ostoskori", "Cart")}
        </button>
      </div>

      {/* TUOTTEET */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {filteredProducts.length === 0 ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", fontSize: "18px", color: "#666" }}>
            {t("Ei tuotteita", "No products found")}
          </p>
        ) : (
          filteredProducts.map((p) => (
            <ProductCard key={p.id} p={p} onAdd={() => addItem(p)} />
          ))
        )}
      </div>

      <CartSidebar />
    </div>
  );
}