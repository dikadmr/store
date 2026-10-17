import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
  type DocumentData,
  type UpdateData,
} from "firebase/firestore";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import app from "./init";

const firestore = getFirestore(app);
const storage = getStorage(app);

// get all data
export async function retrieveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

// get data by id
export async function retrieveDataById(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(firestore, collectionName, id));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

// get data by field
export async function retrieveDataByFields(
  collectionName: string,
  field: string,
  value: string,
) {
  const q = query(
    collection(firestore, collectionName),
    where(field, "==", value),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

// create data
export async function addData(
  collectionName: string,
  data: DocumentData,
): Promise<string> {
  const documentReference = await addDoc(
    collection(firestore, collectionName),
    data,
  );

  return documentReference.id;
}

// update data
export async function updateData(
  collectionName: string,
  id: string,
  data: UpdateData<DocumentData>,
): Promise<void> {
  const documentReference = doc(firestore, collectionName, id);

  await updateDoc(documentReference, data);
}

// delete data
export async function deleteData(
  collectionName: string,
  id: string,
): Promise<void> {
  const documentReference = doc(firestore, collectionName, id);

  await deleteDoc(documentReference);
}

// upload file
export async function uploadFile(file: File, path: string): Promise<string> {
  const storageReference = ref(storage, path);

  await uploadBytes(storageReference, file);

  return getDownloadURL(storageReference);
}

export { firestore, storage };
