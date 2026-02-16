import { db } from '../Firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

class FirebaseService {
  // 1. STORE: Add a new operative
  async addOperative(squadId, formData) {
    try {
      return await addDoc(collection(db, "soldiers"), {
        name: formData.callsign,
        rank: formData.rank,
        bpm: parseInt(formData.restingHeartRate),
        squadId: squadId,
        status: "STABLE",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Firebase Service Error (Add):", error);
      throw error;
    }
  }

  // 2. RETRIEVE & NOTIFY: Listen for real-time updates
  subscribeToSoldiers(callback) {
    const q = query(collection(db, "soldiers"), orderBy("createdAt", "desc"));
    
    // This is the "Get Notified" part
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