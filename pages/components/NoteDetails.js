import styles from '../../styles/Evernote.module.scss'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { database } from '../../utils/firebaseConfig';

export default function NoteDetails({ ID }) {
    const [singleNote, setSingleNote] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteDesc, setNoteDesc] = useState('');

    const getEditData = () => {
        if (isEdit === true) {
            setIsEdit(false);
            return;
        }

        setIsEdit(true);
        setNoteTitle(singleNote.noteTitle);
        setNoteDesc(singleNote.noteDesc);
    }

    const getSingleNote = async () => {
        try {
            setIsEdit(false);
            if (ID) {
                const singleNote = doc(database, 'notes', ID);
                const data = await getDoc(singleNote);
                setSingleNote({ ...data.data(), id: data.id });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const editNote = async (id) => {
        try {
            const collectionById = doc(database, 'notes', id);

            await updateDoc(collectionById, {
                noteTitle,
                noteDesc,
            });

            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    const deleteNote = async (id) => {
        try {
            const collectionById = doc(database, 'notes', id);

            await deleteDoc(collectionById);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSingleNote();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ID])

    return (
        <>
            <div>
                <button className={styles.editBtn} onClick={getEditData}>
                    {!isEdit ? 'Edit' : 'Cancel'}
                </button>
                <button className={styles.deleteBtn} onClick={() => deleteNote(singleNote.id)}>
                    Delete
                </button>
                <div
                    style={{ display: isEdit ? '' : 'none' }}
                    className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        placeholder='Enter the Title..'
                        onChange={(e) => setNoteTitle(e.target.value)}
                        value={noteTitle}
                    />
                    <div className={styles.ReactQuill}>
                        <ReactQuill
                            onChange={setNoteDesc}
                            value={noteDesc}
                        />
                    </div>
                    <button
                        onClick={() => editNote(singleNote.id)}
                        className={styles.saveBtn}>
                        Update Note
                    </button>
                </div>
            </div>
            <div style={{ display: isEdit ? 'none' : '' }}>
                <h2>{singleNote.noteTitle}</h2>
                <div dangerouslySetInnerHTML={{ __html: singleNote.noteDesc }}></div>
            </div>
        </>
    )
}