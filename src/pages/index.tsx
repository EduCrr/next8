import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "../styles/styles.module.scss";
export default function Home() {
  return (
    <>
      <Head>
        <title>Board Home</title>
      </Head>
      <main className={styles.content}>
        <img src="/img/board-user.svg" alt="" />
        <section className={styles.callToAction}>
          <h1>Uma ferramenta para o seu dia...</h1>
          <p>
            <span>100% gratuita</span> e online.
          </p>
        </section>
        <div className={styles.donate}></div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      revalidate: 60 * 60,
    },
  };
};
