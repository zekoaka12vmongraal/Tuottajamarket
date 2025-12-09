import React, { useState } from "react";
import { useCart } from '../components/CartContext.jsx';
import { useLang } from '../components/LanguageContext.jsx';

export default function Checkout() {
  const { cart, clear } = useCart();
  const { lang, toggleLang, t } = useLang();
  
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + ((item.prize || item.price || 0) * item.qty), 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      payment.cardNumber.length < 16 ||
      payment.cardName.length < 2 ||
      payment.expiry.length < 4 ||
      payment.cvc.length < 3
    ) {
      alert(t('Täytä kaikki kentät', 'Fill all fields'));
      return;
    }

    clear();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <button
          onClick={toggleLang}
          style={langButtonStyle}
        >
          {lang === 'fi' ? '🇬🇧 English' : '🇫🇮 Suomi'}
        </button>
        <h1>{t('Kiitos!', 'Thank you!')}</h1>
        <p>{t('Tilauksesi on käsitelty', 'Your order has been processed')}</p>

        <button
          onClick={() => (window.location.href = "/")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          {t('Takaisin etusivulle', 'Back to Home')}
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "450px", margin: "40px auto", fontFamily: "Arial" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "10px 20px",
            fontSize: "15px",
            cursor: "pointer"
          }}
        >
          ← {t('Takaisin', 'Back')}
        </button>

        <button
          onClick={toggleLang}
          style={langButtonStyle}
        >
          {lang === 'fi' ? '🇬🇧 EN' : '🇫🇮 FI'}
        </button>
      </div>

      <h1>{t('Kassa', 'Checkout')}</h1>

      <h2>{t('Ostoskori', 'Shopping Cart')}</h2>
      {cart.length === 0 ? (
        <p>{t('Ostoskori on tyhjä', 'Cart is empty')}</p>
      ) : (
        <ul style={{ paddingLeft: "20px" }}>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} x{item.qty} – {((item.prize || item.price || 0) * item.qty).toFixed(2)} €
            </li>
          ))}
        </ul>
      )}

      <h3>{t('Yhteensä', 'Total')}: {totalPrice.toFixed(2)} €</h3>

      <hr style={{ margin: "25px 0" }} />

      <h2>{t('Asiakastiedot', 'Customer Info')}</h2>

      <div>
        <label>{t('Nimi', 'Name')}</label>
        <input
          type="text"
          placeholder="John Doe"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          style={inputStyle}
        />

        <label>{t('Sähköposti', 'Email')}</label>
        <input
          type="email"
          placeholder="example@gmail.com"
          value={customer.email}
          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          style={inputStyle}
        />

        <label>{t('Puhelin', 'Phone')}</label>
        <input
          type="tel"
          placeholder="0401234567"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          style={inputStyle}
        />

        <hr style={{ margin: "25px 0" }} />

        <h2>{t('Maksutiedot', 'Payment Info')}</h2>

        <label>{t('Kortin numero', 'Card Number')}</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={payment.cardNumber}
          onChange={(e) =>
            setPayment({ ...payment, cardNumber: e.target.value })
          }
          style={inputStyle}
        />

        <label>{t('Kortinhaltija', 'Card Holder')}</label>
        <input
          type="text"
          placeholder="John Doe"
          value={payment.cardName}
          onChange={(e) =>
            setPayment({ ...payment, cardName: e.target.value })
          }
          style={inputStyle}
        />

        <label>{t('Voimassaolo', 'Expiry')}</label>
        <input
          type="text"
          placeholder="12/29"
          value={payment.expiry}
          onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
          style={inputStyle}
        />

        <label>{t('CVC', 'CVC')}</label>
        <input
          type="text"
          placeholder="123"
          value={payment.cvc}
          onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
          style={inputStyle}
        />

        <button
          onClick={handleSubmit}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            background: "#008cff",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          {t('Maksa tilaus', 'Pay Order')}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  fontSize: "15px"
};

const langButtonStyle = {
  padding: "8px 15px",
  fontSize: "14px",
  cursor: "pointer",
  background: "#f0f0f0",
  border: "1px solid #ddd",
  borderRadius: "4px"
};