import React, { useState } from "react";
import { useCart } from "./CartContext";

export default function CartSidebar() {
  const {
    items, removeItem, changeQty, clearCart,
    cartOpen, setCartOpen
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null); // {orderId, total}
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    mobilepayNumber: "",
    paypalEmail: "",
    iban: ""
  });

  const total = items.reduce((s, i) => s + (Number(i.prize || i.price || 0) * (i.qty || 1)), 0);

  // Basic validators
  const validators = {
    name: v => v && v.trim().length >= 2,
    address: v => v && v.trim().length >= 5,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || ""),
    cardNumber: v => /^\d{13,19}$/.test((v || "").replace(/\s+/g, "")),
    expiry: v => /^\d{2}\/\d{2}$/.test(v || ""), // MM/YY
    cvc: v => /^\d{3,4}$/.test(v || ""),
    mobilepayNumber: v => /^\+?\d{6,15}$/.test(v || ""),
    paypalEmail: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || ""),
    iban: v => /^[A-Z]{2}[0-9A-Z]{13,30}$/.test((v||"").replace(/\s+/g, "").toUpperCase())
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!validators.name(form.name)) e.name = "Invalid name";
      if (!validators.email(form.email)) e.email = "Invalid email";
    }
    if (s === 2) {
      if (!validators.address(form.address)) e.address = "Invalid address";
    }
    if (s === 3) {
      if (paymentMethod === "card") {
        if (!validators.cardNumber(form.cardNumber)) e.cardNumber = "Invalid card number";
        if (!validators.expiry(form.expiry)) e.expiry = "Invalid expiry (MM/YY)";
        if (!validators.cvc(form.cvc)) e.cvc = "Invalid CVC";
      } else if (paymentMethod === "mobilepay") {
        if (!validators.mobilepayNumber(form.mobilepayNumber)) e.mobilepayNumber = "Invalid MobilePay number";
      } else if (paymentMethod === "paypal") {
        if (!validators.paypalEmail(form.paypalEmail)) e.paypalEmail = "Invalid PayPal email";
      } else if (paymentMethod === "bank") {
        if (!validators.iban(form.iban)) e.iban = "Invalid IBAN";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const apiUrl = import.meta.env.VITE_API_URL || "";

  const confirmOrder = async () => {
    if (!validateStep(3)) return;
    if (items.length === 0) {
      alert("Ostoskori on tyhjä");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({ id: i.id, name: i.name, price: Number(i.prize || i.price || 0), qty: i.qty })),
        customer: { name: form.name, email: form.email, address: form.address },
        payment: { method: paymentMethod }
      };

      const res = await fetch(`${apiUrl}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Server error");
      }

      const data = await res.json();

      setOrderSuccess({ orderId: data.orderId || ("ORDER-" + Date.now()), total: data.total || total });
      clearCart();
      setCheckoutOpen(false);
      setStep(1);

      // Sulje ostoskorin ja näytä vahvistus
      setTimeout(() => {
        setCartOpen(false);
      }, 250);

    } catch (err) {
      console.error("Checkout error:", err);
      alert("Tilaus epäonnistui: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setCheckoutOpen(false);
    setStep(1);
    setForm({
      name: "",
      address: "",
      email: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
      mobilepayNumber: "",
      paypalEmail: "",
      iban: ""
    });
    setErrors({});
    setPaymentMethod("card");
  };

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 998
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: cartOpen ? 0 : "-500px",
          width: "450px",
          maxWidth: "95vw",
          height: "100vh",
          background: "#fff",
          boxShadow: "0 0 30px rgba(0,0,0,0.35)",
          padding: "22px",
          transition: "right .28s ease",
          overflowY: "auto",
          zIndex: 999,
          color: "#111",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        {/* Close */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Ostoskori</h2>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => setCartOpen(false)}
              style={{
                background: "#eee", border: "1px solid #ccc", padding: "6px 10px", cursor: "pointer", borderRadius: "6px"
              }}
            >
              Sulje
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>

          {/* Checkout flow */}
          {checkoutOpen ? (
            <div>
              <h3>Tilaus</h3>

              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <label>Nimi</label>
                  <input style={input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  {errors.name && <div style={err}>{errors.name}</div>}

                  <label>Sähköposti</label>
                  <input style={input} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  {errors.email && <div style={err}>{errors.email}</div>}

                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={backBtn} onClick={() => { setCheckoutOpen(false); setStep(1); }}>Peruuta</button>
                    <button style={nextBtn} onClick={() => { if (validateStep(1)) setStep(2); }}>{loading ? "..." : "Seuraava"}</button>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <label>Osoite</label>
                  <input style={input} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                  {errors.address && <div style={err}>{errors.address}</div>}

                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={backBtn} onClick={() => setStep(1)}>Takaisin</button>
                    <button style={nextBtn} onClick={() => { if (validateStep(2)) setStep(3); }}>Seuraava</button>
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <label>Maksutapa</label>
                  <select style={input} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <option value="card">Kortti</option>
                    <option value="mobilepay">MobilePay</option>
                    <option value="paypal">PayPal</option>
                    <option value="klarna">Klarna</option>
                    <option value="bank">Tilisiirto</option>
                  </select>

                  {paymentMethod === "card" && (
                    <>
                      <label>Kortin numero</label>
                      <input style={input} placeholder="1234123412341234" value={form.cardNumber}
                        onChange={e => setForm({ ...form, cardNumber: e.target.value.replace(/\s+/g, "") })} />
                      {errors.cardNumber && <div style={err}>{errors.cardNumber}</div>}

                      <label>Voimassa (MM/YY)</label>
                      <input style={input} placeholder="06/26" value={form.expiry}
                        onChange={e => setForm({ ...form, expiry: e.target.value })} />
                      {errors.expiry && <div style={err}>{errors.expiry}</div>}

                      <label>CVC</label>
                      <input style={input} placeholder="123" value={form.cvc}
                        onChange={e => setForm({ ...form, cvc: e.target.value })} />
                      {errors.cvc && <div style={err}>{errors.cvc}</div>}
                    </>
                  )}

                  {paymentMethod === "mobilepay" && (
                    <>
                      <label>MobilePay numero</label>
                      <input style={input} placeholder="+358..." value={form.mobilepayNumber}
                        onChange={e => setForm({ ...form, mobilepayNumber: e.target.value })} />
                      {errors.mobilepayNumber && <div style={err}>{errors.mobilepayNumber}</div>}
                    </>
                  )}

                  {paymentMethod === "paypal" && (
                    <>
                      <label>PayPal sähköposti</label>
                      <input style={input} value={form.paypalEmail}
                        onChange={e => setForm({ ...form, paypalEmail: e.target.value })} />
                      {errors.paypalEmail && <div style={err}>{errors.paypalEmail}</div>}
                    </>
                  )}

                  {paymentMethod === "bank" && (
                    <>
                      <label>IBAN</label>
                      <input style={input} value={form.iban}
                        onChange={e => setForm({ ...form, iban: e.target.value })} />
                      {errors.iban && <div style={err}>{errors.iban}</div>}
                    </>
                  )}

                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={backBtn} onClick={() => setStep(2)}>Takaisin</button>
                    <button style={nextBtn} onClick={() => { if (validateStep(3)) setStep(4); }}>Seuraava</button>
                  </div>
                </>
              )}

              {/* STEP 4 - SUMMARY */}
              {step === 4 && (
                <>
                  <h4>Yhteenveto</h4>
                  {items.map(i => (
                    <div key={i.id} style={{ marginBottom: 8 }}>
                      <strong>{i.name}</strong> × {i.qty} — {(Number(i.prize || i.price || 0) * i.qty).toFixed(2)} €
                    </div>
                  ))}
                  <h3>Yhteensä: {total.toFixed(2)} €</h3>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={backBtn} onClick={() => setStep(3)}>Takaisin</button>
                    <button style={confirmBtn} onClick={confirmOrder} disabled={loading}>
                      {loading ? "Käsittely..." : "Vahvista tilaus"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Cart view
            <div>
              {items.length === 0 && <p>Ostoskorisi on tyhjä</p>}

              {items.map(item => (
                <div key={item.id} style={cartItem}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{item.name}</h4>
                      <div style={{ color: "#666" }}>{(Number(item.prize || item.price || 0)).toFixed(2)} €</div>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button style={qtyBtn} onClick={() => changeQty(item.id, (item.qty || 1) - 1)}>-</button>
                      <div style={{ width: 28, textAlign: "center" }}>{item.qty}</div>
                      <button style={qtyBtn} onClick={() => changeQty(item.id, (item.qty || 1) + 1)}>+</button>
                      <button onClick={() => removeItem(item.id)} style={{ marginLeft: 10, color: "red", background: "none", border: "none", cursor: "pointer" }}>Poista</button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length > 0 && (
                <>
                  <h3>Yhteensä: {total.toFixed(2)} €</h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={checkoutBtn} onClick={() => { setCheckoutOpen(true); setStep(1); }}>Siirry kassalle</button>
                    <button style={backBtn} onClick={() => { clearCart(); setCartOpen(false); }}>Tyhjennä</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ORDER SUCCESS MODAL (simple) */}
          {orderSuccess && (
            <div style={{ marginTop: 18, padding: 12, background: "#e6ffed", borderRadius: 8 }}>
              <h3 style={{ margin: 0, color: "green" }}>Tilaus vastaanotettu ✔</h3>
              <p style={{ margin: "6px 0" }}>Tilausnumero: <strong>{orderSuccess.orderId}</strong></p>
              <p style={{ margin: "6px 0" }}>Summa: <strong>{orderSuccess.total.toFixed(2)} €</strong></p>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={nextBtn} onClick={() => { setOrderSuccess(null); resetAll(); }}>Sulje</button>
              </div>
            </div>
          )}

        </div>
      </aside>
    </>
  );
}

/* === STYLES (samantapaiset kuin ennen mutta lisätty muutama) === */

const cartItem = {
  background: "#fafafa",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "12px",
  border: "1px solid #eee"
};

const input = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: "8px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "15px",
  background: "white"
};

const qtyBtn = {
  width: "34px",
  height: "34px",
  background: "#f3f3f3",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer"
};

const checkoutBtn = {
  flex: 1,
  background: "#00a300",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "15px"
};

const nextBtn = {
  flex: 1,
  background: "#0066ff",
  color: "white",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer"
};

const backBtn = {
  flex: 1,
  background: "#777",
  color: "white",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer"
};

const confirmBtn = {
  width: "100%",
  background: "green",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "15px"
};

const err = { color: "crimson", fontSize: 13, marginBottom: 8 };
