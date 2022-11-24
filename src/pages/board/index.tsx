import Head from "next/head";
import styles from "./styles.module.scss";

import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock } from "react-icons/fi";
import { SupportButton } from "../../components/SupportButton";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { FormEvent, useState } from "react";

import db from "../../services/firebase"
import { addDoc, collection } from "firebase/firestore";

interface BoardProps {
  user: {
    name: string;
    id: string;
  };
}

export default function Board({ user }: BoardProps) {

  const [taskDescription, setTaskDescription] = useState("");


  async function handleAddTask(e: FormEvent) {

    e.preventDefault();

    if (!taskDescription) {
      alert('Type a task!')
      return;
    }

    await addDoc(collection(db, "tasks"), {
      createdAt: new Date(),
      task: taskDescription,
      userId: user.id,
      name: user.name,
    }).then((doc) => {
      console.log('okokokokok')
    }).catch((err) => {
      console.log(err)
    })

  }

  return (
    <>
      <Head>
        <title>My tasks</title>
      </Head>
      <main className={styles.container}>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Type your task..."
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <button type="submit">
            <FiPlus size={25} color="#17181f" />
          </button>
        </form>
        <h1>You have 2 tasks...</h1>

        <section>
          <article className={styles.taskList}>
            <p>Thats only test.</p>
            <div className={styles.actions}>
              <div>
                <div>
                  <FiCalendar size={20} color="#ffb800" />
                  <time>Today</time>
                </div>
                <button>
                  <FiEdit2 size={20} color="#fff" />
                  <span>Edit</span>
                </button>
              </div>
              <button>
                <FiTrash size={20} color="#ff3636" />
                <span>Delete</span>
              </button>
            </div>
          </article>
        </section>
      </main>

      <div className={styles.vipContainer}>
        <h3>Thanks for supporting this project.</h3>
        <div>
          <FiClock size={28} color="#fff" />
          <time>Last donation has been 3 days...</time>
        </div>
      </div>

      <SupportButton />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session: any = await getSession({ req });

  if (!session?.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = {
    name: session?.user.name,
    id: session?.id,
  };

  return {
    props: {
      user,
    },
  };
};
