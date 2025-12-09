import { useLang } from "./LanguageContext";
import "./Footer.css";

export default function Footer() {
  const { t } = useLang();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <p className="footer-name">
            <strong>Aleksi Forssell</strong>
          </p>
          <p className="footer-school">Gradia</p>
        </div>
        
        <div className="footer-copyright">
          <p>© {currentYear} Tuottajamarket. {t("Kaikki oikeudet pidätetään.", "All rights reserved.")}</p>
        </div>
      </div>
    </footer>
  );
}