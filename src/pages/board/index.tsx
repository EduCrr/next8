import styles from "./styles.module.scss";
import Head from "next/head";
import { FiCalendar, FiClock, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { SupportButton } from "../../components/SupportButton";
import { GetServerSideProps } from "next";
import { useState, FormEvent } from "react";
import { getSession } from "next-auth/client";
import firebase from "../../services/firebaseConnection";
type BoardPros = {
  user: {
    id: string;
    nome: string;
  };
};
const Board = ({ user }: BoardPros) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();

    if (inputValue === "") {
      alert("preencha algo");
      return;
    }

    await firebase
      .firestore()
      .collection("tarefas")
      .add({
        created: new Date(),
        tarefa: inputValue,
        userId: user.id,
        nome: user.nome,
      })
      .then((doc) => {
        console.log("cadastrado");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Head>
        <title>Board</title>
      </Head>
      <main className={styles.container}>
        <form onSubmit={handleAddTask}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite tarefa"
            type="text"
          />
          <button type="submit">
            <FiPlus size={25} color="#17181f" />
          </button>
        </form>
        <h1>Voce tem 2 tarefas</h1>
        <section>
          <article className={styles.taskList}>
            <p>Aprender aasa</p>
            <div className={styles.actions}>
              <div>
                <div>
                  <FiCalendar size={20} color="#ffb800" />
                  <time>20 de abril</time>
                </div>
                <button>
                  <FiEdit size={20} color="#fff" />
                </button>
              </div>
              <button>
                <FiTrash size={20} color="#ff3636" />
                <span>Excluir</span>
              </button>
            </div>
          </article>
        </section>
      </main>
      <div className={styles.vipContainer}>
        <h3>Obrigado por apoiar esse projeto!</h3>
        <div>
          <FiClock size={28} color="white" />
          <time>Ultima doaçao há 3 dias</time>
        </div>
      </div>

      <SupportButton />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  //se n ta logado
  if (!session?.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const user = {
    nome: session?.user.name,
    id: session?.id,
  };
  return {
    props: {
      user,
    },
  };
};

export default Board;
