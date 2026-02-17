import { db } from '../Firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,           // Added for referencing specific documents
  updateDoc,    // Added for editing
  deleteDoc     // Added for deleting
} from 'firebase/firestore';

class FirebaseService {
  /* ---------------- SQUAD ACTIONS ---------------- */

  async addSquad(squadName) {
    try {
      return await addDoc(collection(db, "squads"), {
        name: squadName,
        status: "ACTIVE",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Firebase Service Error (Add Squad):", error);
      throw error;
    }
  }

  // NEW: Update Squad Name
  async updateSquad(squadId, newName) {
    try {
      const squadRef = doc(db, "squads", squadId);
      await updateDoc(squadRef, { name: newName });
    } catch (error) {
      console.error("Firebase Service Error (Update Squad):", error);
      throw error;
    }
  }

  // NEW: Delete Squad
  async deleteSquad(squadId) {
    try {
      const squadRef = doc(db, "squads", squadId);
      await deleteDoc(squadRef);
    } catch (error) {
      console.error("Firebase Service Error (Delete Squad):", error);
      throw error;
    }
  }

  subscribeToSquads(callback) {
    const q = query(collection(db, "squads"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
      const squads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(squads);
    });
  }

  /* ---------------- OPERATIVE ACTIONS ---------------- */

  async addOperative(squadId, formData) {
    try {
      return await addDoc(collection(db, "soldiers"), {
        name: formData.callsign || "UNNAMED",
        rank: formData.rank || "OPERATIVE",
        bpm: parseInt(formData.restingHeartRate) || 72,
        squadId: squadId,
        status: "STABLE",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Firebase Service Error (Add):", error);
      throw error;
    }
  }

  // NEW: Update Operative Data
  async updateOperative(operativeId, updateData) {
    try {
      const operativeRef = doc(db, "soldiers", operativeId);
      await updateDoc(operativeRef, updateData);
    } catch (error) {
      console.error("Firebase Service Error (Update Operative):", error);
      throw error;
    }
  }

  // NEW: Delete Operative
  async deleteOperative(operativeId) {
    try {
      const operativeRef = doc(db, "soldiers", operativeId);
      await deleteDoc(operativeRef);
    } catch (error) {
      console.error("Firebase Service Error (Delete Operative):", error);
      throw error;
    }
  }

  subscribeToSoldiers(callback) {
    const q = query(collection(db, "soldiers"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const soldiers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(soldiers);
    });
  }
}

export default new FirebaseService();