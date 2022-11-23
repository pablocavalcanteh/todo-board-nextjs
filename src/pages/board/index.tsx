import Head from "next/head";
import styles from "./styles.module.scss";

import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock } from "react-icons/fi";
import { SupportButton } from "../../components/SupportButton";

export default function Board() {
  return (
    <>
      <Head>
        <title>My tasks</title>
      </Head>
      <main className={styles.container}>
        <form>
          <input type="text" placeholder="Type your task..." />
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
