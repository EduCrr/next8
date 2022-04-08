import styles from "./styles.module.scss";
import Link from "next/link";
import { Button } from "../Button/index";
export const Header = () => {
  return (
    <header>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href="/">
            <img src="/img/logo.svg" alt="" />
          </Link>
          <nav>
            <Link href="/">
              <a>Home</a>
            </Link>
            <Link href="/board">
              <a>Meu board</a>
            </Link>
          </nav>
          <Button />
        </div>
      </div>
    </header>
  );
};
