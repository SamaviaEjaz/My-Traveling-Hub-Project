import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, FlatList, Alert, TextInput, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriverContext } from './DriverContext';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { BASE_URL } from '../../apiConfig';

const CITY_COORDINATES = {
  'karachi': { latitude: 24.8607, longitude: 67.0011, name: 'Karachi' },
  'lahore': { latitude: 31.5497, longitude: 74.3436, name: 'Lahore' },
  'islamabad': { latitude: 33.6844, longitude: 73.0479, name: 'Islamabad' },
  'rawalpindi': { latitude: 33.5651, longitude: 73.0169, name: 'Rawalpindi' },
  'peshawar': { latitude: 34.0151, longitude: 71.5249, name: 'Peshawar' },
  'quetta': { latitude: 30.1798, longitude: 66.9750, name: 'Quetta' },
  'faisalabad': { latitude: 31.4504, longitude: 73.1350, name: 'Faisalabad' },
  'multan': { latitude: 30.1575, longitude: 71.5249, name: 'Multan' },
  'hyderabad': { latitude: 25.3969, longitude: 68.3771, name: 'Hyderabad' },
  'sukkur': { latitude: 27.7052, longitude: 68.8574, name: 'Sukkur' },
  'sheikhupura': { latitude: 31.7167, longitude: 73.9850, name: 'Sheikhupura' },
  'gujranwala': { latitude: 32.1877, longitude: 74.1945, name: 'Gujranwala' },
  'sialkot': { latitude: 32.4945, longitude: 74.5229, name: 'Sialkot' },
  'sargodha': { latitude: 32.0836, longitude: 72.6711, name: 'Sargodha' },
  'bahawalpur': { latitude: 29.3956, longitude: 71.6722, name: 'Bahawalpur' },
  'jhang': { latitude: 31.2681, longitude: 72.3181, name: 'Jhang' },
  'gujrat': { latitude: 32.5742, longitude: 74.0789, name: 'Gujrat' },
  'kasur': { latitude: 31.1177, longitude: 74.4583, name: 'Kasur' },
  'rahim yar khan': { latitude: 28.4202, longitude: 70.2952, name: 'Rahim Yar Khan' },
  'sahiwal': { latitude: 30.6704, longitude: 73.1078, name: 'Sahiwal' },
  'okara': { latitude: 30.8081, longitude: 73.4596, name: 'Okara' },
  'wah': { latitude: 33.7969, longitude: 72.7297, name: 'Wah Cantt' },
  'dera ghazi khan': { latitude: 30.0561, longitude: 70.6403, name: 'Dera Ghazi Khan' },
  'mirpur khas': { latitude: 25.5276, longitude: 69.0111, name: 'Mirpur Khas' },
  'nawabshah': { latitude: 26.2442, longitude: 68.4100, name: 'Nawabshah' },
  'kamoke': { latitude: 31.9744, longitude: 74.2247, name: 'Kamoke' },
  'mandi bahauddin': { latitude: 32.5861, longitude: 73.4917, name: 'Mandi Bahauddin' },
  'jhelum': { latitude: 32.9425, longitude: 73.7257, name: 'Jhelum' },
  'sadiqabad': { latitude: 28.3089, longitude: 70.1261, name: 'Sadiqabad' },
  'jacobabad': { latitude: 28.2769, longitude: 68.4514, name: 'Jacobabad' },
  'shikarpur': { latitude: 27.9556, longitude: 68.6383, name: 'Shikarpur' },
  'khanewal': { latitude: 30.3017, longitude: 71.9321, name: 'Khanewal' },
  'hafizabad': { latitude: 32.0706, longitude: 73.6878, name: 'Hafizabad' },
  'kohat': { latitude: 33.5869, longitude: 71.4414, name: 'Kohat' },
  'muridke': { latitude: 31.8025, longitude: 74.2556, name: 'Muridke' },
  'muzaffargarh': { latitude: 30.0703, longitude: 71.1933, name: 'Muzaffargarh' },
  'khanpur': { latitude: 28.6467, longitude: 70.6617, name: 'Khanpur' },
  'gojra': { latitude: 31.1492, longitude: 72.6831, name: 'Gojra' },
  'mian channu': { latitude: 30.4419, longitude: 72.3550, name: 'Mian Channu' },
  'abbottabad': { latitude: 34.1495, longitude: 73.1995, name: 'Abbottabad' },
  'turbat': { latitude: 26.0062, longitude: 63.0490, name: 'Turbat' },
  'dadu': { latitude: 26.7308, longitude: 67.7782, name: 'Dadu' },
  'bahawalnagar': { latitude: 29.9878, longitude: 73.2475, name: 'Bahawalnagar' },
  'chakwal': { latitude: 32.9328, longitude: 72.8633, name: 'Chakwal' },
  'larkana': { latitude: 27.5590, longitude: 68.2123, name: 'Larkana' },
  'chiniot': { latitude: 31.7292, longitude: 72.9783, name: 'Chiniot' },
  'swabi': { latitude: 34.1201, longitude: 72.4698, name: 'Swabi' },
  'vehari': { latitude: 30.0452, longitude: 72.3489, name: 'Vehari' },
  'mardan': { latitude: 34.1958, longitude: 72.0447, name: 'Mardan' },
  'attock': { latitude: 33.7669, longitude: 72.3600, name: 'Attock' },
  'skp': { latitude: 31.7167, longitude: 73.9850, name: 'Sheikhupura' },
  'rwp': { latitude: 33.5651, longitude: 73.0169, name: 'Rawalpindi' },
  'isb': { latitude: 33.6844, longitude: 73.0479, name: 'Islamabad' },
  'lhr': { latitude: 31.5497, longitude: 74.3436, name: 'Lahore' },
  'khi': { latitude: 24.8607, longitude: 67.0011, name: 'Karachi' },
};

const CITY_NAMES = Object.values(CITY_COORDINATES).map(city => city.name);

const SharePost = ({ navigation }) => {
  const route = useRoute();
  const { driverName: contextDriverName } = useContext(DriverContext);

  const [driverName, setDriverName] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [time, setTime] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [seats, setSeats] = useState('');
  const [showSeatsPicker, setShowSeatsPicker] = useState(false);
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showLocationInputModal, setShowLocationInputModal] = useState(false);
  const [showRouteMapModal, setShowRouteMapModal] = useState(false);
  const [mapType, setMapType] = useState('from');
  const [mapRegion, setMapRegion] = useState({
    latitude: 30.3753,
    longitude: 69.3451,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [routeWaypoints, setRouteWaypoints] = useState([]);
  const [manualLocationInput, setManualLocationInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const seatsOptions = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  const vehicleOptions = ['Car', 'Hiace', 'Bus', 'Jeep', 'Coaster', 'Van', 'Suzuki', 'Bike'];

  useEffect(() => {
    const name = contextDriverName || route.params?.driverName;
    if (name) setDriverName(name);
    else AsyncStorage.getItem('driverName').then(n => setDriverName(n || 'Ahsan'));
  }, [contextDriverName, route.params?.driverName]);

  const handleDateChange = (_, selected) => {
    setShowDatePicker(false);
    if (!selected) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      Alert.alert("Invalid Date", "Please select today or a future date.");
      return;
    }

    setDateTime(selected.toISOString().split('T')[0]);
    setSelectedDate(selected);
  };

 const handleTimeChange = (_, selected) => {
    setShowTimePicker(false);
    if (!selected) return;

    const h = selected.getHours();
    const m = selected.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const formattedTime = `${h12 < 10 ? '0' + h12 : h12}:${m < 10 ? '0' + m : m} ${ampm}`;
    setTime(formattedTime);
    setSelectedTime(selected);
  };

  const handlePost = async () => {
    if (!from || !to || !dateTime || !time || !vehicle || !seats) {
      Alert.alert("Missing Information", "Please fill in all fields before posting.");
      return;
    }

    try {
      setIsLoading(true);
      const backendUrl =`${BASE_URL}/api/rides`;

      const checkRes = await fetch(backendUrl);
      const checkData = await checkRes.json();
      const existing = checkData.rides.find(r => r.driverName === driverName);

      if (existing) {
        Alert.alert("Already Shared", "You already have a shared ride. Please delete it before sharing a new Post.");
        setIsLoading(false);
        return;
      }

      const routeData = routeWaypoints.map(wp => {
        const waypointName = wp.name || `Point (${wp.latitude.toFixed(4)}, ${wp.longitude.toFixed(4)})`;
        return {
          name: waypointName,
          latitude: parseFloat(wp.latitude),
          longitude: parseFloat(wp.longitude)
        };
      });

      console.log('Sending route data:', routeData);
      console.log('From location:', fromLocation);
      console.log('To location:', toLocation);

      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverName,
          from,
          to,
          date: dateTime,
          time,
          vehicle,
          seats,
          route: routeData,  
          fromLocation: fromLocation ? {
            latitude: parseFloat(fromLocation.latitude),
            longitude: parseFloat(fromLocation.longitude),
            name: fromLocation.name || from
          } : null,
          toLocation: toLocation ? {
            latitude: parseFloat(toLocation.latitude),
            longitude: parseFloat(toLocation.longitude),
            name: toLocation.name || to
          } : null
        }),
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Success", "Ride shared successfully!");
        navigation.navigate("Driver_Dashboard");
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error('Error posting ride:', error);
      Alert.alert("Error", "Failed to connect to server. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderDropdownItem = (item, setSelected, setShow) => (
    <TouchableOpacity
      key={item}
      style={styles.dropdownItem}
      onPress={() => {
        setSelected(item);
        setShow(false);
      }}
    >
      <Text style={styles.dropdownItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const handleCityInputChange = (text) => {
    setManualLocationInput(text);

    if (text.length > 0) {
      const filteredCities = CITY_NAMES.filter(city =>
        city.toLowerCase().includes(text.toLowerCase())
      );
      setCitySuggestions(filteredCities);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setCitySuggestions([]);
    }
  };

  const getCityCoordinates = (locationName) => {
    const cityName = locationName.toLowerCase().trim();

    // Direct match
    if (CITY_COORDINATES[cityName]) {
      return CITY_COORDINATES[cityName];
    }

    // Partial match
    for (const city in CITY_COORDINATES) {
      if (city.includes(cityName) || cityName.includes(city)) {
        return CITY_COORDINATES[city];
      }
    }

    return null;
  };

  const handleCitySelection = (cityName) => {
    setManualLocationInput(cityName);
    setShowSuggestions(false);

    const cityKey = Object.keys(CITY_COORDINATES).find(key =>
      CITY_COORDINATES[key].name === cityName
    );

    if (cityKey) {
      const coordinates = CITY_COORDINATES[cityKey];

      if (mapType === 'from') {
        setFrom(cityName);
        setFromLocation(coordinates);
      } else {
        setTo(cityName);
        setToLocation(coordinates);
      }

      setShowLocationInputModal(false);
      setManualLocationInput('');
    }
  };

  const handleManualLocationSubmit = () => {
    if (manualLocationInput.trim()) {
      const locationName = manualLocationInput.trim();

      const cityKey = Object.keys(CITY_COORDINATES).find(key =>
        CITY_COORDINATES[key].name.toLowerCase() === locationName.toLowerCase()
      );

      let finalCityName = locationName;
      let coordinates;

      if (cityKey) {
        finalCityName = CITY_COORDINATES[cityKey].name;
        coordinates = CITY_COORDINATES[cityKey];
      } else {
        coordinates = getCityCoordinates(locationName);

        if (!coordinates) {
          Alert.alert(
            "City Not Found",
            `"${locationName}" is not in our city list. Please select from suggestions or try a different city name.`
          );
          return;
        }

        const matchedCity = Object.values(CITY_COORDINATES).find(city =>
          city.latitude === coordinates.latitude && city.longitude === coordinates.longitude
        );

        if (matchedCity) {
          finalCityName = matchedCity.name;
        }
      }

      if (mapType === 'from') {
        setFrom(finalCityName);
        setFromLocation(coordinates);
      } else {
        setTo(finalCityName);
        setToLocation(coordinates);
      }

      setManualLocationInput('');
      setShowLocationInputModal(false);
    }
  };

  const findNearestCity = (latitude, longitude) => {
    let minDistance = Infinity;
    let nearestCity = null;

    Object.values(CITY_COORDINATES).forEach(city => {
      const distance = Math.sqrt(
        Math.pow(latitude - city.latitude, 2) +
        Math.pow(longitude - city.longitude, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    });

    if (minDistance > 0.5) {
      return null;
    }

    return nearestCity;
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const nearestCity = findNearestCity(latitude, longitude);

    const newWaypoint = nearestCity
      ? { ...nearestCity, latitude, longitude }
      : {
          latitude,
          longitude,
          name: `Point (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        };

    setRouteWaypoints([...routeWaypoints, newWaypoint]);
  };

  const removeWaypoint = (index) => {
    const updated = routeWaypoints.filter((_, i) => i !== index);
    setRouteWaypoints(updated);
  };

  const clearRoute = () => {
    setRouteWaypoints([]);
  };

  const getRouteCoordinates = () => {
    if (!fromLocation || !toLocation) return [];

    const points = [
      { latitude: fromLocation.latitude, longitude: fromLocation.longitude },
      ...routeWaypoints.map(wp => ({ latitude: wp.latitude, longitude: wp.longitude })),
      { latitude: toLocation.latitude, longitude: toLocation.longitude }
    ];

    return points;
  };

  const fitMapToRoute = () => {
    if (!fromLocation || !toLocation) return;

    const coordinates = getRouteCoordinates();
    if (coordinates.length === 0) return;

    const lats = coordinates.map(c => c.latitude);
    const lngs = coordinates.map(c => c.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = (maxLat - minLat) * 1.5;
    const lngDelta = (maxLng - minLng) * 1.5;

    setMapRegion({
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 1),
      longitudeDelta: Math.max(lngDelta, 1),
    });
  };

  useEffect(() => {
    if (showRouteMapModal && fromLocation && toLocation) {
      fitMapToRoute();
    }
  }, [showRouteMapModal, fromLocation, toLocation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.driverHeader}>
        <Image
          source={require('../../assets/images/ProfilePhoto.png')}
          style={styles.driverImage}
        />
        <View style={styles.driverTextContainer}>
          <Text style={styles.driverName}>{driverName}</Text>
          <Text style={styles.shareRideText}>Share a Ride</Text>
        </View>
      </View>

      {/* FROM */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => {
          setMapType('from');
          setManualLocationInput('');
          setShowSuggestions(false);
          setShowLocationInputModal(true);
        }}
      >
        <Text style={from ? styles.inputText : styles.placeholderText}>
          {from || 'From (Enter city name)'}
        </Text>
      </TouchableOpacity>

      {/* TO */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => {
          setMapType('to');
          setManualLocationInput('');
          setShowSuggestions(false);
          setShowLocationInputModal(true);
        }}
      >
        <Text style={to ? styles.inputText : styles.placeholderText}>
          {to || 'To (Enter city name)'}
        </Text>
      </TouchableOpacity>

      {/* SELECT ROUTE BUTTON */}
      {from && to && (
        <TouchableOpacity
          style={styles.routeButton}
          onPress={() => {
            setShowRouteMapModal(true);
          }}
        >
          <Text style={styles.routeButtonText}>
            📍 {routeWaypoints.length > 0
              ? `Route Selected (${routeWaypoints.length} stops)`
              : 'Select Your Route (Optional)'}
          </Text>
        </TouchableOpacity>
      )}

      {/* OTHER INPUTS */}
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={dateTime ? styles.inputText : styles.placeholderText}>
          {dateTime ? `📅 ${dateTime}` : '📅 Select Date'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
        <Text style={time ? styles.inputText : styles.placeholderText}>
          {time ? `🕐 ${time}` : '🕐 Select Time'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.input} onPress={() => setShowVehiclePicker(true)}>
        <Text style={vehicle ? styles.inputText : styles.placeholderText}>
          {vehicle ? `🚗 ${vehicle}` : '🚗 Select Vehicle'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.input} onPress={() => setShowSeatsPicker(true)}>
        <Text style={seats ? styles.inputText : styles.placeholderText}>
          {seats ? `💺 ${seats} Seats` : '💺 Available Seats'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={handlePost}
        disabled={isLoading}
      >
        <Text style={styles.buttontext}>
          {isLoading ? '⏳ Posting...' : '✅ Share Post'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          onChange={handleTimeChange}
        />
      )}

      <Modal
        visible={showLocationInputModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {mapType === 'from' ? '🚀 Departure City' : '🏁 Destination City'}
            </Text>
            <Text style={styles.helperText}>Enter city name or select from suggestions</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type city name..."
                value={manualLocationInput}
                onChangeText={handleCityInputChange}
                autoFocus
              />
            </View>

            {showSuggestions && citySuggestions.length > 0 && (
              <ScrollView style={styles.suggestionsContainer}>
                {citySuggestions.map((city, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleCitySelection(city)}
                  >
                    <Text style={styles.suggestionText}>📍 {city}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {manualLocationInput.length > 0 && citySuggestions.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  ❌ No cities found matching "{manualLocationInput}"
                </Text>
                <Text style={styles.noResultsHint}>
                  Try: Karachi, Lahore, Islamabad, Sheikhupura, SKP, etc.
                </Text>
              </View>
            )}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowLocationInputModal(false);
                  setManualLocationInput('');
                  setShowSuggestions(false);
                }}
              >
                <Text style={styles.cancelButtonText}>❌ Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleManualLocationSubmit}
              >
                <Text style={styles.confirmButtonText}>✅ Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showRouteMapModal}
        animationType="slide"
      >
        <View style={styles.routeModalContainer}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeTitle}>🗺️ Select Your Route</Text>
            <Text style={styles.routeSubtitle}>
              Tap on map to add waypoints (cities you'll pass through)
            </Text>
          </View>

          <MapView
            style={styles.map}
            region={mapRegion}
            onPress={handleMapPress}
          >
            {fromLocation && (
              <Marker
                coordinate={{
                  latitude: fromLocation.latitude,
                  longitude: fromLocation.longitude
                }}
                pinColor="green"
                title={from}
                description="🚀 Starting Point"
              />
            )}

            {routeWaypoints.map((waypoint, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: waypoint.latitude,
                  longitude: waypoint.longitude
                }}
                pinColor="blue"
                title={waypoint.name || `Waypoint ${index + 1}`}
                description={`Stop ${index + 1}`}
              />
            ))}

            {toLocation && (
              <Marker
                coordinate={{
                  latitude: toLocation.latitude,
                  longitude: toLocation.longitude
                }}
                pinColor="red"
                title={to}
                description="🏁 Destination"
              />
            )}

            {fromLocation && toLocation && (
              <Polyline
                coordinates={getRouteCoordinates()}
                strokeColor="#297ce9"
                strokeWidth={4}
              />
            )}
          </MapView>

          {routeWaypoints.length > 0 && (
            <View style={styles.waypointsContainer}>
              <View style={styles.waypointsHeader}>
                <Text style={styles.waypointsTitle}>
                  🛣️ Waypoints ({routeWaypoints.length})
                </Text>
                <TouchableOpacity
                  style={styles.clearRouteButton}
                  onPress={clearRoute}
                >
                  <Text style={styles.clearRouteText}>🗑️ Clear All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {routeWaypoints.map((waypoint, index) => (
                  <View key={index} style={styles.waypointChip}>
                    <Text style={styles.waypointText}>
                      {waypoint.name || `Point ${index + 1}`}
                    </Text>
                    <TouchableOpacity onPress={() => removeWaypoint(index)}>
                      <Text style={styles.removeWaypointText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.routeButtonContainer}>
            <TouchableOpacity
              style={styles.routeCancelButton}
              onPress={() => {
                setShowRouteMapModal(false);
              }}
            >
              <Text style={styles.routeButtonTextWhite}>❌ Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.routeConfirmButton}
              onPress={() => {
                setShowRouteMapModal(false);
              }}
            >
              <Text style={styles.routeButtonTextWhite}>✅ Confirm Route</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* VEHICLE MODAL */}
      <Modal visible={showVehiclePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🚗 Select Vehicle</Text>
            <FlatList
              data={vehicleOptions}
              keyExtractor={item => item}
              renderItem={({ item }) => renderDropdownItem(item, setVehicle, setShowVehiclePicker)}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowVehiclePicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SEATS MODAL */}
      <Modal visible={showSeatsPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>💺 Select Seats</Text>
            <FlatList
              data={seatsOptions}
              keyExtractor={item => item}
              renderItem={({ item }) => renderDropdownItem(item, setSeats, setShowSeatsPicker)}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSeatsPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SharePost;

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f7fa' },
  driverHeader: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 3,
    borderColor: '#297ce9'
  },
  driverTextContainer: { marginLeft: 15, justifyContent: 'center' },
  driverName: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
  shareRideText: { color: '#666', fontSize: 14, marginTop: 2 },
  input: {
    height: 55,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputText: { fontSize: 16, color: '#1a1a1a' },
  placeholderText: { color: '#999', fontSize: 16 },
  routeButton: {
    backgroundColor: '#e3f2fd',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#297ce9',
    shadowColor: '#297ce9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  routeButtonText: { color: '#297ce9', fontSize: 16, fontWeight: 'bold' },
  button: {
    backgroundColor: '#297ce9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#297ce9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledButton: { backgroundColor: '#a0a0a0', shadowOpacity: 0.1 },
  buttontext: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: 8
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center'
  },
  inputContainer: { marginBottom: 15, position: 'relative' },
  textInput: {
    height: 50,
    borderWidth: 2,
    borderColor: '#297ce9',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  suggestionsContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#ddd',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#fff',
    marginTop: -8
  },
  suggestionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  suggestionText: { fontSize: 16, color: '#333' },
  noResultsContainer: {
    padding: 15,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    marginTop: 10
  },
  noResultsText: {
    fontSize: 14,
    color: '#e65100',
    fontWeight: 'bold',
    marginBottom: 5
  },
  noResultsHint: { fontSize: 12, color: '#666' },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  cancelButtonText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  confirmButton: {
    flex: 1,
    backgroundColor: '#297ce9',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  confirmButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  routeModalContainer: { flex: 1, backgroundColor: '#fff' },
  routeHeader: {
    padding: 18,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 2,
    borderBottomColor: '#297ce9'
  },
  routeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center'
  },
  routeSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5
  },
  map: { flex: 1 },
  waypointsContainer: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderTopWidth: 2,
    borderTopColor: '#297ce9'
  },
  waypointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  waypointsTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  clearRouteButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  clearRouteText: { color: '#d32f2f', fontSize: 14, fontWeight: 'bold' },
  waypointChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#297ce9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#297ce9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  waypointText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 10,
    fontWeight: '600'
  },
  removeWaypointText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  routeButtonContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  routeCancelButton: {
    flex: 1,
    backgroundColor: '#999',
    padding: 16,
    marginRight: 8,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  routeConfirmButton: {
    flex: 1,
    backgroundColor: '#297ce9',
    padding: 16,
    marginLeft: 8,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#297ce9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  routeButtonTextWhite: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  dropdownItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 16, color: '#333' },
  closeButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10
  },
  closeButtonText: { color: '#297ce9', fontSize: 16, fontWeight: 'bold' }
});