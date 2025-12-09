import { useNavigate, useLocation } from "react-router-dom";
import { useLang } from "./LanguageContext";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLang, t } = useLang();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate("/")}>
          <span className="logo-text">Tuottajamarket</span>
        </div>

        <nav className="nav">
          {location.pathname !== "/store" && (
            <button 
              className="nav-button"
              onClick={() => navigate("/store")}
            >
              {t("Verkkokauppaan", "To Store")}
            </button>
          )}

          <button 
            className="lang-button"
            onClick={toggleLang}
          >
            {lang === 'fi' ? '🇬🇧 EN' : '🇫🇮 FI'}
          </button>
        </nav>
      </div>
    </header>
  );
}