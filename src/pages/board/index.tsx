import styles from "./styles.module.scss";
import Head from "next/head";
import {
  FiCalendar,
  FiClock,
  FiEdit,
  FiPlus,
  FiTrash,
  FiX,
} from "react-icons/fi";
import { SupportButton } from "../../components/SupportButton";
import { GetServerSideProps } from "next";
import { useState, FormEvent } from "react";
import { getSession } from "next-auth/client";
import firebase from "../../services/firebaseConnection";
import { format, formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

type ListType = {
  id: string;
  created: string | Date;
  createdFormated: string;
  tarefa: string;
  userId: string;
  nome: string;
};

type BoardPros = {
  user: {
    id: string;
    nome: string;
    vip: boolean;
    lastDonate: string | Date;
  };
  data: string;
};

const Board = ({ user, data }: BoardPros) => {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState<ListType[]>(JSON.parse(data));
  const [listEdit, setListEdit] = useState<ListType | null>(null);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();

    if (inputValue === "") {
      alert("preencha algo");
      return;
    }

    //alterar uma tarefa
    if (listEdit) {
      await firebase
        .firestore()
        .collection("tarefas")
        .doc(listEdit.id)
        .update({
          tarefa: inputValue,
        })
        .then(() => {
          let data = list;
          let listIndex = list.findIndex((item) => item.id === listEdit.id);
          data[listIndex].tarefa = inputValue;
          setList(data);
          setListEdit(null);
          setInputValue("");
        })
        .catch((error) => {
          console.log(error);
        });

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
        let data = {
          id: doc.id,
          created: new Date(),
          createdFormated: format(new Date(), "dd MMMM yyyy"),
          tarefa: inputValue,
          userId: user.id,
          nome: user.nome,
        };
        setList([...list, data]); //pegando todas e tarefas existentes e a atual
        setInputValue("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = async (id: string) => {
    await firebase
      .firestore()
      .collection("tarefas")
      .doc(id)
      .delete()
      .then(() => {
        let newList = list.filter((item) => item.id !== id);
        setList(newList);
        alert("deletado com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEdit = async (list: ListType) => {
    setListEdit(list);
    setInputValue(list.tarefa);
  };
  const handleCanselEdit = () => {
    setInputValue("");
    setListEdit(null);
  };
  return (
    <>
      <Head>
        <title>Board</title>
      </Head>
      <main className={styles.container}>
        {listEdit && (
          <>
            <span className={styles.warning}>
              <button onClick={handleCanselEdit}>
                <FiX size={30} color="#ff3636" />
              </button>
              Você está editando uma tarefa!{" "}
            </span>
          </>
        )}
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
        <h1>
          Voce tem {list.length} {list.length === 1 ? "tarefa" : "tarefas"}
        </h1>
        <section>
          {list.length > 0 &&
            list.map((item, k) => (
              <article className={styles.taskList} key={k}>
                <Link href={`/board/${item.id}`}>
                  <p>{item.tarefa}</p>
                </Link>
                <div className={styles.actions}>
                  <div>
                    <div>
                      <FiCalendar size={20} color="#ffb800" />
                      <time>{item.createdFormated}</time>
                    </div>
                    <button onClick={() => handleEdit(item)}>
                      <FiEdit size={20} color="#fff" />
                    </button>
                  </div>
                  <button onClick={() => handleDelete(item.id)}>
                    <FiTrash size={20} color="#ff3636" />
                    <span>Excluir</span>
                  </button>
                </div>
              </article>
            ))}
        </section>
      </main>
      {user.vip && (
        <div className={styles.vipContainer}>
          <h3>Obrigado por apoiar esse projeto!</h3>
          <div>
            <FiClock size={28} color="white" />
            <time>
              Ultima doaçao foi{" "}
              {formatDistance(new Date(user.lastDonate), new Date(), {
                locale: ptBR,
              })}
            </time>
          </div>
        </div>
      )}
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

  //chamando as tarefas
  const lists = await firebase
    .firestore()
    .collection("tarefas")
    .where("userId", "==", session?.id)
    .orderBy("created", "asc")
    .get();

  const data = JSON.stringify(
    lists.docs.map((item) => {
      return {
        id: item.id,
        createdFormated: format(item.data().created.toDate(), "dd MMMM yyyy"),
        ...item.data(),
      };
    })
  );

  //dados user
  const user = {
    nome: session?.user.name,
    id: session?.id,
    vip: session?.vip,
    lastDonate: session?.lastDonate,
  };
  return {
    props: {
      user,
      data,
    },
  };
};

export default Board;
