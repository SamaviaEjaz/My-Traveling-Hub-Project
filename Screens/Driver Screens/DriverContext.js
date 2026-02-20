// DriverContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DriverContext = createContext();

export const DriverProvider = ({ children }) => {
  const [driverData, setDriverData] = useState(null);
  const [driverName, setDriverName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);

  // Normalize driver name
  const normalizeName = (name) =>
    typeof name === 'string' ? name.trim().toLowerCase() : null;

  // Load driver data once on mount
  useEffect(() => {
    loadDriverData();
  }, []);

  const loadDriverData = useCallback(async () => {
    try {
      const dataString = await AsyncStorage.getItem('driverData');
      const nameString = await AsyncStorage.getItem('driverName');
      const sessionString = await AsyncStorage.getItem('userSession');

      if (sessionString) setUserSession(sessionString);

      if (dataString) {
        const parsedData = JSON.parse(dataString);
        if (parsedData) {
          setDriverData(parsedData);
          if (parsedData.name) {
            setDriverName(normalizeName(parsedData.name));
          }
        }
      } else if (nameString) {
        setDriverName(normalizeName(nameString));
      }

      // Only one log to indicate loading done
      console.log("DriverContext: Driver data loaded");
    } catch (error) {
      console.error("DriverContext: Error loading driver data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveDriverData = useCallback(async (data) => {
    try {
      await AsyncStorage.setItem('driverData', JSON.stringify(data));
      setDriverData(data);
      if (data.name) setDriverName(normalizeName(data.name));

      console.log("DriverContext: Driver data saved");
      return true;
    } catch (error) {
      console.error("DriverContext: Error saving driver data:", error);
      return false;
    }
  }, []);

  const saveDriverName = useCallback(async (name) => {
    try {
      const normalized = normalizeName(name);
      await AsyncStorage.setItem('driverName', normalized);
      setDriverName(normalized);
      console.log("DriverContext: Driver name saved");
      return true;
    } catch (error) {
      console.error("DriverContext: Error saving driver name:", error);
      return false;
    }
  }, []);

  const createUserSession = useCallback(async (name) => {
    try {
      const sessionId = `session_${normalizeName(name)}_${Date.now()}`;
      await AsyncStorage.setItem('userSession', sessionId);
      setUserSession(sessionId);
      console.log("DriverContext: User session created");
      return sessionId;
    } catch (error) {
      console.error("DriverContext: Error creating user session:", error);
      return null;
    }
  }, []);

  // New function to save profile data with user-specific key
  const saveProfileData = useCallback(async (profileData) => {
    try {
      if (!driverName) return false;
      
      await AsyncStorage.setItem(`driverProfile_${driverName}`, JSON.stringify(profileData));
      console.log("DriverContext: Profile data saved for", driverName);
      return true;
    } catch (error) {
      console.error("DriverContext: Error saving profile data:", error);
      return false;
    }
  }, [driverName]);

  // New function to load profile data with user-specific key
  const loadProfileData = useCallback(async (name = null) => {
    try {
      const targetName = name || driverName;
      if (!targetName) return null;
      
      const data = await AsyncStorage.getItem(`driverProfile_${targetName}`);
      if (data) {
        const profileData = JSON.parse(data);
        console.log("DriverContext: Profile data loaded for", targetName);
        return profileData;
      }
      return null;
    } catch (error) {
      console.error("DriverContext: Error loading profile data:", error);
      return null;
    }
  }, [driverName]);

  // New function to save profile photo with user-specific key
  const saveProfilePhoto = useCallback(async (photoUri, name = null) => {
    try {
      const targetName = name || driverName;
      if (!targetName) return false;
      
      await AsyncStorage.setItem(`profilePhoto_${targetName}`, photoUri);
      console.log("DriverContext: Profile photo saved for", targetName);
      return true;
    } catch (error) {
      console.error("DriverContext: Error saving profile photo:", error);
      return false;
    }
  }, [driverName]);

  // New function to load profile photo with user-specific key
  const loadProfilePhoto = useCallback(async (name = null) => {
    try {
      const targetName = name || driverName;
      if (!targetName) return null;
      
      const photoUri = await AsyncStorage.getItem(`profilePhoto_${targetName}`);
      if (photoUri) {
        console.log("DriverContext: Profile photo loaded for", targetName);
        return photoUri;
      }
      return null;
    } catch (error) {
      console.error("DriverContext: Error loading profile photo:", error);
      return null;
    }
  }, [driverName]);

  // New function to fetch driver profile from server
  const fetchDriverProfile = useCallback(async (name = null) => {
    try {
      const targetName = name || driverName;
      if (!targetName) return null;
      
      const response = await fetch(`http://10.89.188.73:5000/api/drivers?name=${encodeURIComponent(targetName)}`);
      const result = await response.json();
      
      if (response.ok && result.success && result.drivers && result.drivers.length > 0) {
        const driverData = result.drivers[0];
        const profileData = {
          fullName: driverData.name || targetName,
          email: driverData.email || 'Not provided',
          phone: driverData.phone || 'Not provided',
        };
        
        // Save the profile data for future use
        await saveProfileData(profileData);
        
        console.log("DriverContext: Driver profile fetched from server for", targetName);
        return profileData;
      }
      return null;
    } catch (error) {
      console.error("DriverContext: Error fetching driver profile:", error);
      return null;
    }
  }, [driverName, saveProfileData]);

  const clearAllUserData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(['driverData', 'driverName', 'userSession']);

      const allKeys = await AsyncStorage.getAllKeys();
      const removableKeys = allKeys.filter(
        key =>
          key.startsWith('profilePhoto_') ||
          key.includes('post') ||
          key.includes('ride')
      );

      if (removableKeys.length > 0) {
        await AsyncStorage.multiRemove(removableKeys);
      }

      setDriverData(null);
      setDriverName(null);
      setUserSession(null);

      console.log("DriverContext: All user data cleared");
      return true;
    } catch (error) {
      console.error("DriverContext: Error clearing user data:", error);
      return false;
    }
  }, []);

  return (
    <DriverContext.Provider
      value={{
        driverData,
        driverName,
        userSession,
        isLoading,
        saveDriverData,
        saveDriverName,
        createUserSession,
        clearAllUserData,
        loadDriverData,
        // New functions
        saveProfileData,
        loadProfileData,
        saveProfilePhoto,
        loadProfilePhoto,
        fetchDriverProfile
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};