import Head from "next/head";
import styles from "./task.module.scss";

import { FiCalendar } from "react-icons/fi";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";

import db from "../../services/firebase";
import { format } from "date-fns";

type Task = {
  id: string;
  createdAt: string | Date;
  createdAtFormatted: string;
  task: string;
  userId: string;
  name: string;
};

interface TaskProps {
  data: string;
}

export default function Task({ data }: TaskProps) {
  const task = JSON.parse(data) as Task;

  return (
    <>
      <Head>
        <title>Details you task</title>
      </Head>
      <article className={styles.container}>
        <div className={styles.actions}>
          <div>
            <FiCalendar size={30} color="#fff" />
            <span>Created task:</span>
            <time>{task.createdAtFormatted}</time>
          </div>
        </div>
        <p>{task.task}</p>
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {

  const {id} = params;
  const session = await getSession({req});

  if (!session?.id) {
    return {
        redirect: {
            destination: "/",
            permanent: false
        }
    }
  }

  const data = await getDoc(doc(db, "tasks", String(id))).then((snapshot: any) => {
    const data = {
      id: snapshot.id,
      createdAt: snapshot.data().createdAt,
      createdAtFormatted: format(
        snapshot.data().createdAt.toDate(),
        "dd MMMM yyyy"
      ),
      task: snapshot.data().task,
      userId: snapshot.data().userId,
      name: snapshot.data().name,
    };

    return JSON.stringify(data);
  });

  return {
    props: {
      data,
    },
  };
};
