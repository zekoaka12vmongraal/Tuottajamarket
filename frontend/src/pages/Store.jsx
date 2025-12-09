import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../components/CartContext";
import CartSidebar from "../components/CartSidebar";

export default function Store() {
  const { addItem, setCartOpen, t, lang, setLang } = useCart();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(0);

  // HAE TUOTTEET BACKENDILTÄ
  const loadProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/products");
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
    <div style={{ padding: "20px", color: "white" }}>

      {/* LOGO + kielenvaihto + ostoskori */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "32px" }}>Tuottajamarket</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setLang(lang === "fi" ? "en" : "fi")}>
            {lang === "fi" ? "EN" : "FI"}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            style={{
              padding: "10px 20px",
              background: "green",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            🛒 {t("Ostoskori", "Cart")}
          </button>
        </div>
      </div>

      {/* HAKU */}
      <input
        type="text"
        placeholder={t("Hae tuotteita...", "Search products...")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "8px",
          marginBottom: "20px",
          color: "black"
        }}
      />

      {/* KATEGORIA */}
      <select
        value={category}
        onChange={(e) => setCategory(Number(e.target.value))}
        style={{ padding: "10px", marginLeft: "20px", borderRadius: "8px" }}
      >
        <option value={0}>{t("Kaikki kategoriat", "All categories")}</option>
        <option value={1}>{t("Liha", "Meat")}</option>
        <option value={2}>{t("Kala", "Fish")}</option>
        <option value={3}>{t("Viljatuotteet", "Grains")}</option>
        <option value={4}>{t("Marjat", "Berries")}</option>
        <option value={5}>{t("Juustot", "Cheese")}</option>
        <option value={6}>{t("Muut tuotteet", "Other products")}</option>
      </select>

      {/* TUOTTEET */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} p={p} onAdd={() => addItem(p)} />
        ))}
      </div>

      <CartSidebar />
    </div>
  );
}
