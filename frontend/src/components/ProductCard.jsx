import React from "react";

export default function ProductCard({ p, onAdd }) {
  // Tue molempia kenttiä: prize / price
  const price = p.prize || p.price || 0;

  // Valitse lopullinen kuva
  const imageSrc =
    p.image && p.image.trim() !== ""
      ? p.image
      : "https://placehold.co/400x300?text=No+Image";

  return (
    <div className="card">
      <img
        src={imageSrc}
        alt={p.name}
        onError={(e) => {
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
