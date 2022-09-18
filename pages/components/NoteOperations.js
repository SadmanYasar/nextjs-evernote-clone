import styles from '../../styles/Evernote.module.scss'
import { useEffect, useState } from 'react';
import { database } from '../../utils/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const dbInstance = collection(database, 'notes');

export default function NoteOperations({ getSingleNote }) {
    const [isInputVisible, setInputVisible] = useState(false);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteDesc, setNoteDesc] = useState('')
    const [notesArray, setNotesArray] = useState([]);

    const inputToggle = () => {
        setInputVisible(!isInputVisible)
    }

    const addDesc = (value) => {
        setNoteDesc(value)
    }

    const saveNote = async () => {
        try {
            const doc = {
                noteTitle: noteTitle,
                noteDesc: noteDesc
            }
            const response = await addDoc(dbInstance, doc)
            setNotesArray([...notesArray, {
                id: response.id,
                ...doc
            }])

            setNoteTitle('')
            setNoteDesc('')
        } catch (error) {
            console.log(error)
        }
    }

    const getNotes = async () => {
        try {
            const data = await getDocs(dbInstance)
            const mapped_data = data.docs.map((item) => {
                return { ...item.data(), id: item.id }
            });
            setNotesArray(mapped_data);
            getSingleNote(mapped_data[0].id);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className={styles.btnContainer}>
                <button
                    onClick={inputToggle}
                    className={styles.button}>
                    Add a New Note
                </button>
            </div>
            <div
                style={{ display: isInputVisible ? '' : 'none' }}
                className={styles.inputContainer}>
                <input
                    className={styles.input}
                    placeholder='Enter the Title..'
                    onChange={(e) => setNoteTitle(e.target.value)}
                    value={noteTitle}
                />
                <div className={styles.ReactQuill}>
                    <ReactQuill
                        onChange={addDesc}
                        value={noteDesc}
                    />
                </div>
                <button
                    onClick={saveNote}
                    className={styles.saveBtn}>
                    Save Note
                </button>
            </div>
            <div className={styles.notesDisplay}>
                {notesArray.map((note) => {
                    return (
                        <div
                            className={styles.notesInner}
                            onClick={() => getSingleNote(note.id)}
                            key={note.id}>
                            <h4>{note.noteTitle}</h4>
                        </div>
                    )
                })}
            </div>
        </>
    )
}