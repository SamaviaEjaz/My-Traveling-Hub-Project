import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../apiConfig';

export const DriverContext = createContext();

export const DriverProvider = ({ children }) => {
  const [driverData, setDriverData] = useState(null);
  const [driverName, setDriverName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);

  const normalizeName = (name) =>
    typeof name === 'string' ? name.trim() : null;

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
          if (parsedData.name) setDriverName(normalizeName(parsedData.name));
        }
      } else if (nameString) {
        setDriverName(normalizeName(nameString));
      }

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
      console.log("DriverContext: Driver name saved");
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

  const loadProfileData = useCallback(async (name = null) => {
    try {
      const targetName = name || driverName;
      if (!targetName) return null;
      const data = await AsyncStorage.getItem(`driverProfile_${targetName}`);
      if (data) return JSON.parse(data);
      return null;
    } catch (error) {
      console.error("DriverContext: Error loading profile data:", error);
      return null;
    }
  }, [driverName]);

  const saveProfilePhoto = useCallback(async (photoUri, name = null) => {
    try {
      const targetName = name || driverName;
      if (!targetName) return false;
      await AsyncStorage.setItem(`profilePhoto_${targetName}`, photoUri);
      return true;
    } catch (error) {
      console.error("DriverContext: Error saving profile photo:", error);
      return false;
    }
  }, [driverName]);

  const loadProfilePhoto = useCallback(async (name = null) => {
    try {
      const targetName = name || driverName;
      if (!targetName) return null;
      const photoUri = await AsyncStorage.getItem(`profilePhoto_${targetName}`);
      return photoUri || null;
    } catch (error) {
      console.error("DriverContext: Error loading profile photo:", error);
      return null;
    }
  }, [driverName]);

  // ✅ BASE_URL + ngrok header
  const fetchDriverProfile = useCallback(async (name = null) => {
    try {
      const targetName = name || driverName;
      if (!targetName) return null;

      const response = await fetch(`${BASE_URL}/api/drivers?name=${encodeURIComponent(targetName)}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      const result = await response.json();

      if (response.ok && result.success && result.drivers && result.drivers.length > 0) {
        const driver = result.drivers[0];
        const profileData = {
          fullName: driver.name || targetName,
          email: driver.email || 'Not provided',
          phone: driver.phone || 'Not provided',
        };
        await saveProfileData(profileData);
        console.log("DriverContext: Driver profile fetched for", targetName);
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
        saveProfileData,
        loadProfileData,
        saveProfilePhoto,
        loadProfilePhoto,
        fetchDriverProfile,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};