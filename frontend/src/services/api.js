// Luo automaattisesti oikea backend-osoite
const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.origin}/api`;

// Hae kaikki tuotteet
export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}

// Hae yksittäinen tuote
export async function getProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  return res.json();
}

// Checkout
export async function checkout(payload) {
  const res = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.json();
}