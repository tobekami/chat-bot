import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { app } from './firebaseConfig';

const db = getFirestore(app);

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  language: string;
  timestamp: Date;
}

export async function saveMessage(userId: string, message: {text: string, sender: 'user' | 'bot'}, language: string) {
  try {
    await addDoc(collection(db, 'messages'), {
      userId,
      text: message.text,
      sender: message.sender,
      language,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error saving message: ", error);
  }
}

export async function getMessages(userId: string): Promise<Message[]> {
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, where("userId", "==", userId), orderBy("timestamp", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Message, 'id'>)
  }));
}

export async function deleteMessage(userId: string, messageId: string): Promise<void> {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error("Error deleting message: ", error);
  }
}

export async function clearMessages(userId: string): Promise<void> {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db); // Use writeBatch to create a batch instance

    querySnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit(); // Commit the batch operation to delete all selected documents
  } catch (error) {
    console.error("Error clearing messages: ", error);
  }
}
