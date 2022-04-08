import Link from "next/link";
import styles from "./styles.module.scss";
export const SupportButton = () => {
  return (
    <div className={styles.donateContainer}>
      <Link href="/donate">
        <button>Apoiar</button>
      </Link>
    </div>
  );
};
