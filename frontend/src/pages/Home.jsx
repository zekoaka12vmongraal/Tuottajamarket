import { useNavigate } from "react-router-dom";
import { useLang } from "../components/LanguageContext";
import "./Home.css";

export default function Home() {
  const { t } = useLang();
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      title: t("Rekisteröityminen", "Registration"),
      text: t(
        "Aloita rekisteröitymällä Tuottajamarket-verkkopalveluun omalla käyttäjätunnuksellasi ja salasanallasi.",
        "Start by registering to Tuottajamarket web service with your username and password."
      ),
      icon: "👤"
    },
    {
      number: 2,
      title: t("Selaa tuotteita", "Browse Products"),
      text: t(
        "Kirjauduttuasi sisään voit selata monipuolista valikoimaa laadukkaita ja lähellä tuotettuja tuotteita. Käy läpi eri tuotekategorioita ja tutustu tarjontaan.",
        "After logging in, you can browse a diverse selection of quality locally produced products. Go through different product categories and explore the offering."
      ),
      icon: "🛒"
    },
    {
      number: 3,
      title: t("Lisää ostoskoriin", "Add to Cart"),
      text: t(
        "Valittuasi haluamasi tuotteet voit lisätä ne ostoskoriin. Voit valita useita tuotteita eri kategorioista.",
        "After selecting your desired products, you can add them to the cart. You can select multiple products from different categories."
      ),
      icon: "➕"
    },
    {
      number: 4,
      title: t("Tarkista ostokset", "Review Purchases"),
      text: t(
        "Siirry ostoskoriin ja tarkista valintasi ennen tilauksen vahvistamista. Voit muuttaa määriä tai poistaa tuotteita tarvittaessa.",
        "Go to the cart and review your selections before confirming the order. You can change quantities or remove products if needed."
      ),
      icon: "✓"
    },
    {
      number: 5,
      title: t("Tilauksen vahvistus", "Order Confirmation"),
      text: t(
        "Kun olet tyytyväinen ostoskoriisi, vahvista tilauksesi ja syötä tarvittavat toimitustiedot.",
        "When you are satisfied with your cart, confirm your order and enter the necessary delivery information."
      ),
      icon: "📋"
    },
    {
      number: 6,
      title: t("Toimitus kotiovelle", "Home Delivery"),
      text: t(
        "Odota tuotteiden saapumista kotiovellesi. Tuottajamarket-verkkopalvelu toimittaa laadukkaat lähiruokatuotteet vaivattomasti sinulle.",
        "Wait for the products to arrive at your doorstep. Tuottajamarket web service delivers quality local food products effortlessly to you."
      ),
      icon: "🚚"
    },
    {
      number: 7,
      title: t("Nauti lähiruoasta", "Enjoy Local Food"),
      text: t(
        "Saapuneet tuotteet ovat nyt valmiita nautittavaksi. Nauti herkullisista ja laadukkaista lähiruoista omassa arjessasi!",
        "The arrived products are now ready to be enjoyed. Enjoy delicious and quality local foods in your daily life!"
      ),
      icon: "🍽️"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-logo">
            <span className="hero-logo-text">🌾 Tuottajamarket</span>
          </div>
          <h1 className="hero-title">
            {t("Tuoretta lähiruokaa suoraan kotiovellesi!", "Fresh local food straight to your doorstep!")}
          </h1>
          <p className="hero-subtitle">
            {t(
              "Tuottajamarket - Kaupunkilaisille vaivatonta lähiruoan hankintaa.",
              "Tuottajamarket - Effortless local food procurement for city dwellers."
            )}
          </p>
          <button 
            className="hero-cta"
            onClick={() => navigate('/store')}
          >
            {t("Selaa Tuotteita", "Browse Products")} →
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">
            {t("Kuinka se toimii", "How It Works")}
          </h2>
          
          <div className="steps-grid">
            {steps.map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}