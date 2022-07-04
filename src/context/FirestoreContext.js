import { db, storageBucket } from './../firebaseConfig';
import React, { useContext } from 'react';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FirestoreContext = React.createContext();
export const useFirestore = () => {
  return useContext(FirestoreContext);
};

const FirestoreProvider = ({ children }) => {
  const getFileURL = async (file, folder) => {
    if (!file) return;
    const uniqueID = Date.now() + Math.floor(Math.random()).toString();
    const fileRef = ref(storageBucket, `/${folder}/${uniqueID}${file.name}`);

    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const getData = async (table, q) => {
    const dataRef = collection(db, table);
    try {
      if (q) {
        const qq = query(dataRef, ...q);
        const data = await getDocs(qq);
        return data.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
      } else {
        const data = await getDocs(dataRef);
        return data.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
      }
    } catch {
      return `Failed to Get Data from ${table}`;
    }
  };

  const addData = async (table, data) => {
    const dataRef = collection(db, table);
    try {
      await addDoc(dataRef, data);
    } catch (error) {
      return `Failed to Add Data to ${table}`;
    }
  };

  const updateData = async (table, uid, data) => {
    const dataDocRef = doc(db, table, uid);
    try {
      await updateDoc(dataDocRef, data);
    } catch {
      return `Failed to Update Data`;
    }
  };

  const deleteData = async (table, uid) => {
    const dataDocRef = doc(db, table, uid);
    try {
      await deleteDoc(dataDocRef);
    } catch {
      return `Failed to Delete Data`;
    }
  };

  const value = { getData, addData, updateData, deleteData, getFileURL };
  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
};

export default FirestoreProvider;
