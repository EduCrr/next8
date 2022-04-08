import { signIn, signOut, useSession } from "next-auth/client";

import styles from "./styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
export const Button = () => {
  const [session] = useSession();
  return (
    <>
      {session && (
        <button
          type="button"
          className={styles.button}
          onClick={() => signOut()}
        >
          <img src={session.user.image} />
          Olá {session.user.name}
          <FiX color="#737380" className={styles.close} />
        </button>
      )}
      {!session && (
        <button
          type="button"
          className={styles.button}
          onClick={() => signIn("github")}
        >
          <FaGithub color="#ffb800" />
          Entrar no GitHub
        </button>
      )}
    </>
  );
};
