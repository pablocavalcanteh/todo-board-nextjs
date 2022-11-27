import { collection, getDocs } from "firebase/firestore";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

import db from "../services/firebase"
import styles from "../styles/styles.module.scss";

type Donate = {
  id: string;
  donate: boolean;
  lastDonate: Date;
  image: string;
};

interface DonatersProps {
  donaters: string;
}

export default function Home({ donaters }: DonatersProps) {
  const [dtrs, setDtrs] = useState<Donate[]>(JSON.parse(donaters));

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
        {dtrs.length !== 0 && <h3>Donaters</h3>}
        <div className={styles.donaters}>
          {dtrs.map((donater) => (
            <Image key={donater.id} src={donater.image} alt="Donater" width={50} height={50}/>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const donaters = await getDocs(collection(db, "users")).then((donaters) => {
    return JSON.stringify(
      donaters.docs.map((donater) => ({ id: donater.id, ...donater.data() }))
    );
  });

  return {
    props: {
      donaters,
    },
    revalidate: 60 * 60,
  };
};
