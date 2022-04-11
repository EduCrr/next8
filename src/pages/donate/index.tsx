import styles from "./styles.module.scss";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { PayPalButtons } from "@paypal/react-paypal-js";
import firebase from "../../services/firebaseConnection";
import { useState } from "react";
interface DonatePorps {
  user: {
    nome: string;
    id: string;
    image: string;
  };
}

//client ARuGsT5G-BOersBw3g3jIaI1zNEevqXBFfwF0ivrH46X9V_PQmSS7ECLz-q5ccaE9kG8x-_ni0Q41ObN
//<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>

export default function Donate({ user }: DonatePorps) {
  const [vip, setVip] = useState(false);
  const handleSaveDonate = async () => {
    await firebase
      .firestore()
      .collection("users")
      .doc(user.id)
      .set({
        donate: true,
        lastDonate: new Date(),
        image: user.image,
      })
      .then(() => {
        setVip(true);
      });
  };
  return (
    <>
      <Head>
        <title>Ajude a plataforma board ficar online!</title>
      </Head>
      <main className={styles.container}>
        <img src="/img/rocket.svg" alt="Seja Apoiador" />

        {vip && (
          <div className={styles.vip}>
            <img src={user.image} alt="Foto de perfil do usuario" />
            <span>Parabéns você é um novo apoiador!</span>
          </div>
        )}

        <h1>Seja um apoiador deste projeto 🏆</h1>
        <h3>
          Contribua com apenas <span>R$ 1,00</span>
        </h3>
        <strong>
          Apareça na nossa home, tenha funcionalidades exclusivas.
        </strong>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "1",
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(function (details) {
              console.log("compra aprovada " + details.payer.name.given_name);
              handleSaveDonate();
            });
          }}
        />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session?.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  //dados user

  const user = {
    nome: session?.user.name,
    id: session?.id,
    image: session?.user.image,
  };

  return {
    props: {
      user,
    },
  };
};
