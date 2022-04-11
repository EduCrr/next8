import styles from "./styles.module.scss";
import Link from "next/link";
import { Button } from "../Button/index";
import Image from "next/image";
import logo from "../../../public/img/logo.svg";
export const Header = () => {
  return (
    <header>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href="/">
            <a>
              <Image src={logo} alt="" />
            </a>
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
