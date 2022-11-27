import { PayPalButtons } from "@paypal/react-paypal-js";
import { doc, setDoc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

import styles from "./styles.module.scss";
import db from "../../services/firebase";
import { useState } from "react";

interface DonateProps {
  user: {
    name: string;
    id?: string;
    image: string;
  };
}

export default function Donate({ user }: DonateProps) {
  const [vip, setVip] = useState(false);

  async function handleSaveDonate() {

    await setDoc(doc(db, "users", user.id!), {
      donate: true,
      lastDonate: new Date(),
      image: user.image,
    }).then(() => {
      setVip(true);
    });
  }

  return (
    <>
      <Head>
        <title>Help the board plataform get online!</title>
      </Head>
      <main className={styles.donate}>
        <Image
          src="/images/rocket.svg"
          alt="Be supporter"
          width={200}
          height={200}
        />

        {vip && (
            <div className={styles.vip}>
                <Image  src={user.image} alt="Profile photo."/>
                <span>Congratulations! You are a new supporter</span>
            </div>
        )}

        <h1>Be an supporter this project 🏆.</h1>
        <h3>
          Contribute to just <span>R$ 1,00</span>
        </h3>
        <strong>Show up at our home. Get you exclusive features!</strong>

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
            return actions.order!.capture().then((details) => {
              handleSaveDonate();
            });
          }}
        />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session: any = await getSession({req});

  if (!session?.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = {
    name: session?.user?.name,
    id: session?.id!,
    image: session?.user?.image,
  };

  return {
    props: {
      user,
    },
  };
};
