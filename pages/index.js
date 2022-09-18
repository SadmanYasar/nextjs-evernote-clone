import Head from 'next/head'
import NoteOperations from './components/NoteOperations';
import NoteDetails from './components/NoteDetails';
import styles from '../styles/Home.module.css'
import { useState } from 'react';

export default function Home() {
  const [ID, setID] = useState(null);

  const getSingleNote = (id) => {
    setID(id);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Evernote Clone</title>
        <meta name="description" content="Evernote Clone App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.container}>
          <div className={styles.left}>
            <NoteOperations getSingleNote={getSingleNote} />
          </div>
          <div className={styles.right}>
            <NoteDetails ID={ID} />
          </div>
        </div>
      </main>
    </div>
  )
}
