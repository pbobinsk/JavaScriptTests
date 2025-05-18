import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}> {/* Dodatkowy kontener dla wyśrodkowania linków */}
        <Link href="/" className={styles.navLink}>Strona Główna</Link>
        <Link href="/about" className={styles.navLink}>O Nas</Link>
        <Link href="/data" className={styles.navLink}>Dane</Link>
      </div>
    </nav>
  );
};

export default Navbar;