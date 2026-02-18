import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from '../services/FirebaseService';

const MissionContext = createContext();

export const useMission = () => useContext(MissionContext);

export const MissionProvider = ({ children }) => {
    const [squads, setSquads] = useState([]);
    const [soldiers, setSoldiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSquadId, setActiveSquadId] = useState(null);

    useEffect(() => {
        const unsubSquads = firebaseService.subscribeToSquads(setSquads);
        const unsubSoldiers = firebaseService.subscribeToSoldiers((data) => {
            setSoldiers(data);
            setLoading(false);
        });
        return () => { unsubSquads(); unsubSoldiers(); };
    }, []);

    const getSoldierById = (id) => soldiers.find(s => s.id === id);

    const value = {
        squads,
        soldiers,
        loading,
        activeSquadId,      // Exposed state
        setActiveSquadId,   // Exposed setter
        getSoldierById,
        // Re-expose service methods if needed, or just import service directly in components
        addSquad: firebaseService.addSquad,
        updateSquad: firebaseService.updateSquad,
        deleteSquad: firebaseService.deleteSquad,
        addOperative: firebaseService.addOperative,
        deleteOperative: firebaseService.deleteOperative
    };

    return (
        <MissionContext.Provider value={value}>
            {children}
        </MissionContext.Provider>
    );
};
