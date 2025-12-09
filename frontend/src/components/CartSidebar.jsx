import React, { useState } from "react";
import { useCart } from "./CartContext";

export default function CartSidebar() {
  const { items, removeItem, changeQty, cartOpen, setCartOpen, t, lang, setLang } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");

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

  const total = items.reduce((s, i) => s + i.prize * i.qty, 0);

  const label = {
    cart: t("Ostoskori", "Shopping Cart"),
    empty: t("Ostoskorisi on tyhjä", "Your cart is empty"),
    total: t("Yhteensä", "Total"),
    checkout: t("Siirry kassalle", "Checkout"),
    remove: t("Poista", "Remove"),
    orderInfo: t("Tilaustiedot", "Checkout Information"),
    customerInfo: t("Asiakastiedot", "Customer Information"),
    addressInfo: t("Toimitusosoite", "Shipping Address"),
    paymentInfo: t("Maksutiedot", "Payment Details"),
    summary: t("Yhteenveto", "Summary"),
    next: t("Seuraava", "Next"),
    back: t("Takaisin", "Back"),
    confirm: t("Vahvista tilaus", "Confirm Order"),
    name: t("Nimi", "Name"),
    address: t("Osoite", "Address"),
    email: t("Sähköposti", "Email"),
    card: t("Kortti", "Card"),
    mobilepay: "MobilePay",
    paypal: "PayPal",
    klarna: "Klarna",
    bank: t("Tilisiirto", "Bank Transfer"),
    cardNumber: t("Kortin numero", "Card Number"),
    expiry: t("Voimassaoloaika", "Expiry Date"),
    cvc: t("CVC-koodi", "CVC"),
    mobilepayNumber: "MobilePay numero",
    paypalEmail: "PayPal Email",
    iban: "IBAN"
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: cartOpen ? 0 : "-450px",
        width: "450px",
        height: "100vh",
        background: "#ffffff",
        boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        padding: "25px",
        transition: ".35s ease",
        overflowY: "auto",
        zIndex: 999,
        color: "#111",
        fontFamily: "Arial",
      }}
    >
      {/* Close */}
      <button
        onClick={() => {
          setCheckoutOpen(false);
          setStep(1);
          setCartOpen(false);
        }}
        style={{
          float: "right",
          background: "#eee",
          border: "1px solid #aaa",
          padding: "5px 10px",
          cursor: "pointer",
          borderRadius: "6px",
          fontWeight: "bold"
        }}
      >
        X
      </button>

      {/* Language toggle */}
      <button
        onClick={() => setLang(lang === "fi" ? "en" : "fi")}
        style={{
          background: "#ddd",
          border: "1px solid #aaa",
          padding: "6px 10px",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        {lang === "fi" ? "English" : "Suomi"}
      </button>

      <h2 style={{ marginTop: 0 }}>{label.cart}</h2>

      {/* CHECKOUT */}
      {checkoutOpen ? (
        <div style={{ marginTop: "15px" }}>
          <h3>{label.orderInfo}</h3>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h4>{label.customerInfo}</h4>

              <input style={input} placeholder={label.name}
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input style={input} placeholder={label.email}
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

              <button style={nextBtn} onClick={() => setStep(2)}>{label.next}</button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h4>{label.addressInfo}</h4>

              <input style={input} placeholder={label.address}
                value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />

              <button style={backBtn} onClick={() => setStep(1)}>{label.back}</button>
              <button style={nextBtn} onClick={() => setStep(3)}>{label.next}</button>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <h4>{label.paymentInfo}</h4>

              <select
                style={input}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="card">{label.card}</option>
                <option value="mobilepay">{label.mobilepay}</option>
                <option value="paypal">{label.paypal}</option>
                <option value="klarna">{label.klarna}</option>
                <option value="bank">{label.bank}</option>
              </select>

              {paymentMethod === "card" && (
                <>
                  <input style={input} placeholder={label.cardNumber}
                    value={form.cardNumber}
                    onChange={e => setForm({ ...form, cardNumber: e.target.value })} />

                  <input style={input} placeholder={label.expiry}
                    value={form.expiry}
                    onChange={e => setForm({ ...form, expiry: e.target.value })} />

                  <input style={input} placeholder={label.cvc}
                    value={form.cvc}
                    onChange={e => setForm({ ...form, cvc: e.target.value })} />
                </>
              )}

              {paymentMethod === "mobilepay" && (
                <input style={input} placeholder={label.mobilepayNumber}
                  value={form.mobilepayNumber}
                  onChange={e => setForm({ ...form, mobilepayNumber: e.target.value })} />
              )}

              {paymentMethod === "paypal" && (
                <input style={input} placeholder={label.paypalEmail}
                  value={form.paypalEmail}
                  onChange={e => setForm({ ...form, paypalEmail: e.target.value })} />
              )}

              {paymentMethod === "klarna" && (
                <p style={{ padding: "5px", color: "#333" }}>
                  {t(
                    "Sinut ohjataan Klarnaan tilauksen jälkeen.",
                    "You will be redirected to Klarna after confirming."
                  )}
                </p>
              )}

              {paymentMethod === "bank" && (
                <input style={input} placeholder={label.iban}
                  value={form.iban}
                  onChange={e => setForm({ ...form, iban: e.target.value })} />
              )}

              <button style={backBtn} onClick={() => setStep(2)}>{label.back}</button>
              <button style={nextBtn} onClick={() => setStep(4)}>{label.next}</button>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <h4>{label.summary}</h4>

              {items.map(i => (
                <p key={i.id}>{i.name} × {i.qty} — {(i.prize * i.qty).toFixed(2)} €</p>
              ))}

              <h3>{label.total}: {total.toFixed(2)} €</h3>

              <button style={backBtn} onClick={() => setStep(3)}>{label.back}</button>
              <button style={confirmBtn}>{label.confirm}</button>
            </>
          )}
        </div>
      ) : (
        <>
          {/* CART */}

          {items.length === 0 && <p>{label.empty}</p>}

          {items.map((item) => (
            <div key={item.id} style={cartItem}>
              <h4 style={{ margin: 0 }}>{item.name}</h4>
              <p style={{ margin: "4px 0" }}>{item.prize} €</p>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => changeQty(item.id, item.qty - 1)} style={qtyBtn}>-</button>
                <span style={{ width: "30px", textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => changeQty(item.id, item.qty + 1)} style={qtyBtn}>+</button>

                <button
                  onClick={() => removeItem(item.id)}
                  style={{ marginLeft: "auto", color: "red", background: "none", border: "none", cursor: "pointer" }}
                >
                  {label.remove}
                </button>
              </div>
            </div>
          ))}

          {items.length > 0 && (
            <>
              <h3>{label.total}: {total.toFixed(2)} €</h3>

              <button style={checkoutBtn} onClick={() => setCheckoutOpen(true)}>
                {label.checkout}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

/* === STYLES === */

const cartItem = {
  background: "#fafafa",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "15px",
  border: "1px solid #ddd"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
  background: "white"
};

const qtyBtn = {
  width: "30px",
  height: "30px",
  background: "#eee",
  border: "1px solid #aaa",
  borderRadius: "6px",
  fontSize: "18px",
  cursor: "pointer"
};

const checkoutBtn = {
  width: "100%",
  background: "#00a300",
  color: "white",
  padding: "16px",
  marginTop: "20px",
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
  border: "none"
};

const nextBtn = {
  width: "100%",
  background: "#0066ff",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  marginTop: "10px",
  cursor: "pointer",
  border: "none",
  fontSize: "17px"
};

const backBtn = {
  width: "100%",
  background: "#777",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  marginTop: "10px",
  cursor: "pointer",
  border: "none",
  fontSize: "17px"
};

const confirmBtn = {
  width: "100%",
  background: "green",
  color: "white",
  padding: "15px",
  borderRadius: "8px",
  marginTop: "15px",
  cursor: "pointer",
  border: "none",
  fontSize: "18px"
};
