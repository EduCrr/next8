import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "../styles/styles.module.scss";
import firebase from "../services/firebaseConnection";
import { useState } from "react";

type DataProps = {
  data: string;
};

type DataType = {
  id: string;
  donate: boolean;
  lastDonate: Date;
  image: string;
};

export default function Home({ data }: DataProps) {
  const [donaters, setDonaters] = useState<DataType[]>(JSON.parse(data));
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
        {donaters.length !== 0 && <h3>Apoiadores</h3>}
        <div className={styles.donate}>
          {donaters.map((item, k) => (
            <img key={k} src={item.image} alt="" />
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  //donaters
  const donaters = await firebase.firestore().collection("users").get();

  const data = JSON.stringify(
    donaters.docs.map((item) => {
      return {
        id: item.id,
        ...item.data(),
      };
    })
  );

  return {
    props: {
      data,
    },
    revalidate: 60 * 60,
  };
};
