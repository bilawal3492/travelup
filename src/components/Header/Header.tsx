import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.scss';

const NAV_ITEMS = [
  { to: '/', label: 'Home', real: true },
  { to: '/products', label: 'Products', real: true },
  { to: '#', label: 'Deals', real: false },
  { to: '#', label: 'About', real: false },
  { to: '#', label: 'Contact', real: false },
  { to: '/admin', label: 'Admin', real: true },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.header__inner}`}>
        {/* Brand */}
        <Link to="/" className={styles.header__brand}>
          <span className={styles.header__logo} role="img" aria-label="package">
            📦
          </span>
          <span className={styles.header__title}>TravelUp</span>
        </Link>

        {/* Desktop navigation */}
        <nav className={styles.header__nav} aria-label="Main navigation">
          {NAV_ITEMS.map((item) =>
            item.real ? (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  isActive
                    ? `${styles['header__nav-link']} ${styles['header__nav-link--active']}`
                    : styles['header__nav-link']
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <a
                key={item.label}
                href={item.to}
                className={styles['header__nav-link']}
                onClick={(e) => e.preventDefault()}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        {/* Hamburger button (mobile) */}
        <button
          className={styles.header__hamburger}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <nav className={styles['header__mobile-nav']} aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) =>
            item.real ? (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  isActive
                    ? `${styles['header__mobile-link']} ${styles['header__mobile-link--active']}`
                    : styles['header__mobile-link']
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ) : (
              <a
                key={item.label}
                href={item.to}
                className={styles['header__mobile-link']}
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                }}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
