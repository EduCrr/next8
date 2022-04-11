import { format } from "date-fns";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import firebase from "../../services/firebaseConnection";
import styles from "./list.module.scss";
import Head from "next/head";
import { FiCalendar } from "react-icons/fi";

type BoardPros = {
  data: string;
};

type TaskType = {
  id: string;
  created: string | Date;
  createdFormated: string;
  tarefa: string;
  userId: string;
  nome: string;
};

const List = ({ data }: BoardPros) => {
  let list: TaskType = JSON.parse(data); //converte para json
  return (
    <>
      <Head>
        <title>Detalhes da sua tarefa</title>
      </Head>

      <article className={styles.container}>
        <div className={styles.actions}>
          <div>
            <FiCalendar size={30} color="white" />
            <span>Tarefa Criada</span>
            <time>{list.createdFormated}</time>
          </div>
        </div>
        <p>{list.tarefa}</p>
      </article>
    </>
  );
};

export default List;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { id } = params;
  const session = await getSession({ req });

  if (!session?.vip) {
    return {
      redirect: {
        destination: "/board",
        permanent: false,
      },
    };
  }

  const data = await firebase
    .firestore()
    .collection("tarefas")
    .doc(String(id))
    .get()
    .then((snapshot) => {
      const data = {
        id: snapshot.id,
        created: snapshot.data().created,
        createdFormated: format(
          snapshot.data().created.toDate(),
          "dd MMMM yyyy"
        ),
        tarefa: snapshot.data().tarefa,
        userID: snapshot.data().userId,
        nome: snapshot.data().nome,
      };

      return JSON.stringify(data);
    })
    .catch(() => {
      return {};
    });

  if (Object.keys(data).length === 0) {
    return {
      redirect: {
        destination: "/board",
        permanent: false,
      },
    };
  }

  return {
    props: {
      data,
    },
  };
};
