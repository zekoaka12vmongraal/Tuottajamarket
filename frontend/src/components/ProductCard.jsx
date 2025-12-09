import React from "react";

export default function ProductCard({ p, onAdd }) {
  // Tue sekä "prize" että "price" kenttiä
  const price = Number(p.price || p.prize || 0).toFixed(2);

  // Turvallinen kuvalogiikka
  let imageSrc = p.image;

  // Jos kuva puuttuu tai on tyhjä
  if (!imageSrc || imageSrc.trim() === "") {
    imageSrc = "https://placehold.co/400x300?text=No+Image";
  }

  // Jos kuva on pelkkä tiedostonimi (Supabase tapauksissa yleistä):
  // lisää kuvaan backendin domain automaattisesti
  if (!imageSrc.startsWith("http")) {
    imageSrc = `${import.meta.env.VITE_API_URL}/img/${imageSrc}`;
  }

  return (
    <div className="card">
      <img
        src={imageSrc}
        alt={p.name}
        onError={(e) => {
          // Jos URL ei toimi
          e.target.src = "https://placehold.co/400x300?text=Error";
        }}
        className="product-image"
      />

      <div className="card-body">
        <h3 style={{ margin: "6px 0" }}>{p.name}</h3>

        {p.description && (
          <p style={{ color: "#94a3b8", margin: "6px 0" }}>{p.description}</p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>{price} €</strong>

          <button className="btn" onClick={() => onAdd(p)}>
            Lisää ostoskoriin
          </button>
        </div>
      </div>
    </div>
  );
}