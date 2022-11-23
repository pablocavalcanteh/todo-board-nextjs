import { signIn, signOut, useSession } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import Image from "next/image";

import styles from "./styles.module.scss";

export function SignInButton() {
  const { data: session } = useSession();

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => {
        signOut();
      }}
    >
      <Image src={session.user.image} alt="User photo" width={35} height={35} />
      Hi, {session.user.name}!
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => {
        signIn("github");
      }}
    >
      <FaGithub color="#ffb800" />
      Sign In GitHub
    </button>
  );
}
