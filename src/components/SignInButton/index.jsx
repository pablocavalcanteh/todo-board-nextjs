import styles from "./styles.module.scss";

import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import Image from "next/image";

export function SignInButton() {
  const session = false;

  return session ? (
    <button type="button" className={styles.signInButton} onClick={() => {}}>
      <img src="" alt="User photo" />
      Olá, Mateus!
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button type="button" className={styles.signInButton} onClick={() => {}}>
      <FaGithub color="#ffb800" />
      Github login
    </button>
  );
}
