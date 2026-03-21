import React, { useState, useEffect } from 'react';
import { Country, City } from 'country-state-city';

export default function SquadModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState('');
  
  const [countryInput, setCountryInput] = useState('');
  const [countryCode, setCountryCode] = useState('');
  
  const [cityInput, setCityInput] = useState('');

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCountryInput(initialData.countryName || '');
      setCountryCode(initialData.countryCode || '');
      if (initialData.countryCode) {
        setCities(City.getCitiesOfCountry(initialData.countryCode));
      }
      setCityInput(initialData.cityName || '');
    } else {
      setName('');
      setCountryInput('');
      setCountryCode('');
      setCityInput('');
      setCities([]);
    }
  }, [initialData, isOpen]);

  const handleCountryChange = (e) => {
    const val = e.target.value;
    setCountryInput(val);
    const matched = countries.find(c => c.name.toLowerCase() === val.toLowerCase());
    if (matched) {
      setCountryCode(matched.isoCode);
      setCities(City.getCitiesOfCountry(matched.isoCode));
      setCityInput('');
    } else {
      setCountryCode('');
      setCities([]);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Squad designation required.");
    
    let coordinates = null;
    let locationString = '';

    if (cityInput && countryCode) {
       const cityData = cities.find(c => c.name.toLowerCase() === cityInput.toLowerCase());
       if (cityData) {
           coordinates = [parseFloat(cityData.longitude), parseFloat(cityData.latitude)];
           locationString = `${cityData.name}, ${countryInput}`;
       } else {
           // fallback to country if invalid city
           const countryData = countries.find(c => c.isoCode === countryCode);
           coordinates = [parseFloat(countryData.longitude), parseFloat(countryData.latitude)];
           locationString = countryInput;
       }
    } else if (countryCode) {
       const countryData = countries.find(c => c.isoCode === countryCode);
       if (countryData) {
           coordinates = [parseFloat(countryData.longitude), parseFloat(countryData.latitude)];
           locationString = countryInput;
       }
    }

    onSave({ 
      name, 
      countryName: countryInput, 
      countryCode, 
      cityName: cityInput, 
      coordinates, 
      location: locationString 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040a]/80 backdrop-blur-sm">
      <div className="bg-[#0a0f1e] border border-[#1a2238] rounded shadow-[0_0_30px_rgba(0,0,0,0.8)] w-full max-w-md p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-[#1a2238] pb-4">
          <span className="material-symbols-outlined text-blue-500 animate-pulse">radar</span>
          <h2 className="text-sm font-black tracking-[0.3em] text-white">
            {initialData ? "RECONFIGURE SQUAD" : "INITIALIZE SQUAD ASSET"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#4a5578] tracking-widest uppercase">Squad Designation</label>
            <input 
              autoFocus
              className="bg-[#050810] border border-[#1a2238] p-3 text-sm text-white rounded outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all font-mono"
              placeholder="e.g. ALPHA TANGO"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#4a5578] tracking-widest uppercase">Deployment Country</label>
            <input
              list="country-list"
              className="bg-[#050810] border border-[#1a2238] p-3 text-sm text-white rounded outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all font-mono"
              placeholder="Search country..."
              value={countryInput}
              onChange={handleCountryChange}
              required
            />
            <datalist id="country-list">
              {countries.map(c => (
                <option key={c.isoCode} value={c.name} />
              ))}
            </datalist>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#4a5578] tracking-widest uppercase">Operating Base / Area</label>
            <input
              list="city-list"
              className="bg-[#050810] border border-[#1a2238] p-3 text-sm text-white rounded outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Search sector/city..."
              value={cityInput}
              onChange={e => setCityInput(e.target.value)}
              disabled={!countryCode || cities.length === 0}
            />
            <datalist id="city-list">
              {cities.map(c => (
                <option key={c.name} value={c.name} />
              ))}
            </datalist>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#1a2238]">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 rounded text-[10px] font-black tracking-widest uppercase text-[#4a5578] hover:text-red-500 hover:bg-red-500/10 transition-colors border border-transparent"
            >
              Abort
            </button>
            <button 
              type="submit"
              className="px-6 py-2 rounded text-[10px] font-black tracking-widest uppercase text-white bg-blue-600 hover:bg-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
            >
              {initialData ? "Update Link" : "Initiate Uplink"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
