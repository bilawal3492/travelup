import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* ---- Main footer grid ---- */}
      <div className={`container ${styles.footer__main}`}>
        {/* Brand column */}
        <div className={styles.footer__brand}>
          <span className={styles['footer__brand-name']}>📦 TravelUp</span>
          <p className={styles['footer__brand-text']}>
            Your one-stop shop for travel gear, electronics, and everyday
            essentials. Quality products at great prices.
          </p>
          <div className={styles.footer__socials}>
            <a href="#" className={styles['footer__social-link']} aria-label="Facebook">f</a>
            <a href="#" className={styles['footer__social-link']} aria-label="Twitter">𝕏</a>
            <a href="#" className={styles['footer__social-link']} aria-label="Instagram">📷</a>
            <a href="#" className={styles['footer__social-link']} aria-label="LinkedIn">in</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.footer__column}>
          <span className={styles['footer__column-title']}>Shop</span>
          <Link to="/products" className={styles.footer__link}>All Products</Link>
          <a href="#" className={styles.footer__link}>Deals</a>
          <a href="#" className={styles.footer__link}>New Arrivals</a>
          <a href="#" className={styles.footer__link}>Best Sellers</a>
        </div>

        {/* Company */}
        <div className={styles.footer__column}>
          <span className={styles['footer__column-title']}>Company</span>
          <a href="#" className={styles.footer__link}>About Us</a>
          <a href="#" className={styles.footer__link}>Careers</a>
          <a href="#" className={styles.footer__link}>Blog</a>
          <a href="#" className={styles.footer__link}>Contact</a>
        </div>

        {/* Support */}
        <div className={styles.footer__column}>
          <span className={styles['footer__column-title']}>Support</span>
          <a href="#" className={styles.footer__link}>Help Centre</a>
          <a href="#" className={styles.footer__link}>Shipping Info</a>
          <a href="#" className={styles.footer__link}>Returns</a>
          <a href="#" className={styles.footer__link}>Privacy Policy</a>
        </div>
      </div>

      {/* ---- Bottom bar ---- */}
      <div className={styles.footer__bottom}>
        <div className={`container ${styles['footer__bottom-inner']}`}>
          <span className={styles.footer__copy}>
            &copy; {new Date().getFullYear()} TravelUp. All rights reserved.
          </span>
          <span className={styles.footer__tech}>
            Built with React &amp; TypeScript
          </span>
        </div>
      </div>
    </footer>
  );
}
