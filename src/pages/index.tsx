import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/styles.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>Board - Organizing your tasks.</title>
      </Head>
      <main className={styles.contentContainer}>
        <Image
          src="/images/board-user.svg"
          alt="Board user"
          width={400}
          height={400}
        />
        <section className={styles.callToAction}>
          <h1>A tool for your day-to-day Write, plan and organize.</h1>
          <p>
            <span>100% free</span> e online.
          </p>
        </section>
        <div className={styles.donaters}>
          <Image
            src="/images/steve.png"
            alt="User 1"
            width={100}
            height={100}
          />
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {

  return {
    props: {

    },
    revalidate: 60 * 60
  }
}