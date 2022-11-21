import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";

import {SignInButton} from '../SignInButton'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Logo My Board"
            width={50}
            height={50}
          />
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/board">My board</Link>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
