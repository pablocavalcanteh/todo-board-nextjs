import Head from "next/head";
import styles from "./styles.module.scss";

import {
  FiPlus,
  FiCalendar,
  FiEdit2,
  FiTrash,
  FiClock,
  FiX,
} from "react-icons/fi";
import { SupportButton } from "../../components/SupportButton";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { FormEvent, useState } from "react";

import db from "../../services/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { format, formatDistance } from "date-fns";
import Link from "next/link";
import { ptBR } from "date-fns/locale";

type Task = {
  id: string;
  createdAt: string | Date;
  createdAtFormatted?: string;
  task: string;
  userId: string;
  name: string;
};

interface BoardProps {
  user: {
    name: string;
    id: string;
    vip: boolean;
    lastDonate: string | Date;
  };
  data: string;
}

export default function Board({ user, data }: BoardProps) {

  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState<Task[]>(JSON.parse(data));
  const [taskEdit, setTaskEdit] = useState<Task | null | undefined>(null);

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();

    if (!task) {
      alert("Type a task!");
      return;
    }

    if (taskEdit) {
      await updateDoc(doc(db, "tasks", taskEdit.id), {
        task: task,
      }).then(() => {
        let data = taskList;
        let taskIndex = taskList.findIndex((t) => t.id === taskEdit.id);
        data[taskIndex].task = task;

        setTaskList(data);
        setTaskEdit(null);
        setTask("");
      });

      return;
    }

    await addDoc(collection(db, "tasks"), {
      createdAt: new Date(),
      task: task,
      userId: user.id,
      name: user.name,
    })
      .then((doc) => {
        let data = {
          id: doc.id,
          createdAt: new Date(),
          createdAtFormatted: format(new Date(), "dd MMMM yyyy"),
          task: task,
          userId: user.id,
          name: user.name,
        };

        setTaskList([...taskList, data]);
        setTask("");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "tasks", id))
      .then(() => {
        let taskDeleted = taskList.filter((t) => {
          return t.id !== id;
        });

        setTaskList(taskDeleted);
      })
      .catch(() => alert("Delete failed!"));
  }

  function handleEditCancel() {
    setTask("");
    setTaskEdit(null);
  }

  async function handleEdit(task: Task) {
    setTask(task.task);
    setTaskEdit(task);
  }

  return (
    <>
      <Head>
        <title>My tasks</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.warn}>
            <button onClick={() => handleEditCancel()}>
              <FiX size={30} color="#ff3636" />
            </button>
            Editing...
          </span>
        )}
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Type your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button type="submit">
            <FiPlus size={25} color="#17181f" />
          </button>
        </form>
        <h1>
          You have {taskList.length} {taskList.length === 1 ? "task" : "tasks"}
        </h1>

        <section>
          {taskList.map((task) => (
            <article key={task.id} className={styles.taskList}>
              <Link href={`/board/${task.id}`}>
                <p>{task.task}</p>
              </Link>

              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#ffb800" />
                    <time>{task.createdAtFormatted}</time>
                  </div>
                  {user.vip && (
                    <button onClick={() => handleEdit(task)}>
                      <FiEdit2 size={20} color="#fff" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
                <button onClick={() => handleDelete(task.id)}>
                  <FiTrash size={20} color="#ff3636" />
                  <span>Delete</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {user.vip && (
        <div className={styles.vipContainer}>
          <h3>Thanks for supporting this project.</h3>
          <div>
            <FiClock size={28} color="#fff" />
            <time>Last donation has been {formatDistance(new Date(user.lastDonate), new Date(), {locale: ptBR})}</time>
          </div>
        </div>
      )}

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

  const tasks = await getDocs(
    query(
      collection(db, "tasks"),
      where("userId", "==", session.id),
      orderBy("createdAt", "asc")
    )
  )
    .then((tasksList) => {
      return tasksList.docs.map((t) => {
        return {
          id: t.id,
          createdAtFormatted: format(
            t.data().createdAt.toDate(),
            "dd MMMM yyyy"
          ),
          ...t.data(),
        };
      });
    })
    .catch((err) => console.log(err));

  const tasksDbJson = JSON.stringify(tasks);

  const user = {
    name: session?.user.name,
    id: session?.id,
    vip: session?.vip,
    lastDonate: session?.lastDonate ?? null,
  };

  return {
    props: {
      user,
      data: tasksDbJson,
    },
  };
};
