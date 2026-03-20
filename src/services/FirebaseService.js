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
  deleteDoc,    // Added for deleting
  where,
  getDocs
} from 'firebase/firestore';

const generateTacticalId = async (squadId, squadName) => {
  // 1. Get Short Name (First 2 letters of squad)
  const prefix = squadName ? squadName.substring(0, 2).toUpperCase() : "OP";
  
  // 2. Get current count of soldiers in this squad for the serial
  const q = query(collection(db, "soldiers"), where("squadId", "==", squadId));
  const snapshot = await getDocs(q);
  const serialNumber = (snapshot.size + 1).toString().padStart(2, '0');
  
  return `${prefix}-${serialNumber}`; // Result: AL-01
};
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
  async verifySoldierId(serviceId) {
    try {
      // 1. Create a query to find the soldier by Service ID
      const soldiersRef = collection(db, "soldiers");
      const q = query(soldiersRef, where("serviceId", "==", serviceId.toUpperCase().trim()));
      
      // 2. Execute the query
      const querySnapshot = await getDocs(q);
      
      // 3. If a match is found, return the soldier data
      if (!querySnapshot.empty) {
        const soldierDoc = querySnapshot.docs[0];
        return {
          id: soldierDoc.id,
          ...soldierDoc.data()
        };
      }
      
      // 4. Return null if no soldier matches
      return null;
    } catch (error) {
      console.error("Firebase Service Error (Auth):", error);
      throw error;
    }
  }

 /* ---------------- OPERATIVE ACTIONS ---------------- */

  async addOperative(squadId, squadName,formData) {
    try {
      const autoId = await generateTacticalId(squadId, squadName);
      return await addDoc(collection(db, "soldiers"), {
        // CHANGE: Use formData.name to match your OperativeModal
        name: formData.name || "UNNAMED", 
        rank: formData.rank || "OPERATIVE",
        serviceId: autoId, // Auto-generated based on Squad
        device: formData.device || "MW-BIO-091", // Added to match modal
        bpm: parseInt(formData.bpm) || 72,
        spo2: parseInt(formData.spo2) || 98,
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
      // Ensure updateData contains 'name' and not 'callsign'
      await updateDoc(operativeRef, {
        ...updateData,
        updatedAt: serverTimestamp() // Good practice for tracking changes
      });
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