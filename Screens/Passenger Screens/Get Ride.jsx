import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, Polyline } from 'react-native-maps';

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

const GetRide = ({ navigation }) => {
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');
  const [timeSearch, setTimeSearch] = useState('');
  const [rides, setRides] = useState([]);
  const [bookedRides, setBookedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverProfile, setDriverProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [driverImage, setDriverImage] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  // Store parsed route coordinates so both fitMap and Polyline use same data
  const [parsedRouteCoords, setParsedRouteCoords] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 30.3753,
    longitude: 69.3451,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });

  useEffect(() => {
    fetchRides();
    fetchBookedRides();
  }, []);

  const fetchRides = () => {
    setLoading(true);
    fetch("http://10.133.138.73:5000/api/rides")
      .then(res => res.json())
      .then(data => {
        setRides(data.rides || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching rides:', err);
        setLoading(false);
      });
  };

  const fetchBookedRides = () => {
    fetch("http://10.133.138.73:5000/api/bookings/user")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBookedRides(data.bookings || []);
        }
      })
      .catch(err => console.error(err));
  };

  const fetchDriverProfile = async (driverName) => {
    setProfileLoading(true);
    try {
      const storedProfile = await AsyncStorage.getItem(`driverProfile_${driverName}`);
      if (storedProfile) {
        const profileData = JSON.parse(storedProfile);
        setDriverProfile({
          fullName: profileData.fullName || driverName,
          email: profileData.email || 'Not provided',
          phone: profileData.phone || 'Not provided',
        });
      } else {
        try {
          const response = await fetch(`http://10.133.138.73:5000/api/drivers?name=${driverName}`);
          const result = await response.json();

          if (response.ok && result.success && result.drivers && result.drivers.length > 0) {
            const driverData = result.drivers[0];
            setDriverProfile({
              fullName: driverData.name || driverName,
              email: driverData.email || 'Not provided',
              phone: driverData.phone || 'Not provided',
            });
            await AsyncStorage.setItem(`driverProfile_${driverName}`, JSON.stringify({
              fullName: driverData.name || driverName,
              email: driverData.email || 'Not provided',
              phone: driverData.phone || 'Not provided',
            }));
          } else {
            setDriverProfile({ fullName: driverName, email: 'Not available', phone: 'Not available' });
          }
        } catch (error) {
          setDriverProfile({ fullName: driverName, email: 'Not available', phone: 'Not available' });
        }
      }

      const savedImageUri = await AsyncStorage.getItem(`profilePhoto_${driverName}`);
      if (savedImageUri) {
        setDriverImage({ uri: savedImageUri });
      } else {
        setDriverImage(require('../../assets/images/Profileimage.png'));
      }
    } catch (error) {
      setDriverProfile({ fullName: driverName, email: 'Not available', phone: 'Not available' });
      setDriverImage(require('../../assets/images/Profileimage.png'));
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDriverImagePress = (driverName) => {
    setSelectedDriver(driverName);
    fetchDriverProfile(driverName);
    setShowProfileModal(true);
  };

  const getCityCoordinates = (locationName) => {
    if (!locationName) return null;
    const cityName = locationName.toLowerCase().trim();
    if (CITY_COORDINATES[cityName]) return CITY_COORDINATES[cityName];
    for (const city in CITY_COORDINATES) {
      if (city.includes(cityName) || cityName.includes(city)) {
        return CITY_COORDINATES[city];
      }
    }
    return null;
  };

  /**
   * Parse a single waypoint object/string into { latitude, longitude, name }
   * Returns null if parsing fails.
   */
  const parseWaypoint = (waypoint, index) => {
    if (!waypoint) return null;

    // Case 1: Object with numeric latitude/longitude (set by SharePost map press)
    if (typeof waypoint === 'object') {
      const lat = parseFloat(waypoint.latitude);
      const lng = parseFloat(waypoint.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        return {
          latitude: lat,
          longitude: lng,
          name: waypoint.name || `Stop ${index + 1}`,
        };
      }
      // Case 2: Object with only name (fallback to city lookup)
      if (waypoint.name) {
        const coords = getCityCoordinates(waypoint.name);
        if (coords) return { ...coords, name: waypoint.name };
      }
    }

    // Case 3: Plain string city name
    if (typeof waypoint === 'string' && waypoint.trim()) {
      const coords = getCityCoordinates(waypoint.trim());
      if (coords) return { ...coords, name: waypoint.trim() };
    }

    return null;
  };

  /**
   * Build the full ordered coordinate list:
   * [from, ...waypoints, to]
   * Returns array of { latitude, longitude, name }
   */
  const buildRoutePoints = (ride) => {
    if (!ride) return [];

    const points = [];

    // --- FROM ---
    if (
      ride.fromLocation &&
      !isNaN(parseFloat(ride.fromLocation.latitude)) &&
      !isNaN(parseFloat(ride.fromLocation.longitude))
    ) {
      points.push({
        latitude: parseFloat(ride.fromLocation.latitude),
        longitude: parseFloat(ride.fromLocation.longitude),
        name: ride.fromLocation.name || ride.from,
      });
    } else {
      const coords = getCityCoordinates(ride.from);
      if (coords) points.push({ ...coords, name: ride.from });
    }

    // --- WAYPOINTS ---
    if (Array.isArray(ride.route) && ride.route.length > 0) {
      ride.route.forEach((wp, i) => {
        const parsed = parseWaypoint(wp, i);
        if (parsed) points.push(parsed);
      });
    }

    // --- TO ---
    if (
      ride.toLocation &&
      !isNaN(parseFloat(ride.toLocation.latitude)) &&
      !isNaN(parseFloat(ride.toLocation.longitude))
    ) {
      points.push({
        latitude: parseFloat(ride.toLocation.latitude),
        longitude: parseFloat(ride.toLocation.longitude),
        name: ride.toLocation.name || ride.to,
      });
    } else {
      const coords = getCityCoordinates(ride.to);
      if (coords) points.push({ ...coords, name: ride.to });
    }

    return points;
  };

  const fitMapToPoints = (points) => {
    if (!points || points.length === 0) return;

    const lats = points.map(p => p.latitude);
    const lngs = points.map(p => p.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    setMapRegion({
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5, 1),
      longitudeDelta: Math.max((maxLng - minLng) * 1.5, 1),
    });
  };

  const handleShowRoute = (ride) => {
    const points = buildRoutePoints(ride);

    if (points.length === 0) {
      alert('No route data available for this ride.');
      return;
    }

    setSelectedRide(ride);
    setParsedRouteCoords(points);
    fitMapToPoints(points);
    setShowRouteModal(true);
  };

  const filteredRides = rides.filter(ride => {
    const isBooked = bookedRides.some(booking => booking.rideId === ride._id);
    if (isBooked) return false;
    return (
      (ride.from || "").toLowerCase().includes(fromSearch.toLowerCase()) &&
      (ride.to || "").toLowerCase().includes(toSearch.toLowerCase()) &&
      (ride.date || "").toLowerCase().includes(dateSearch.toLowerCase()) &&
      (ride.time || "").toLowerCase().includes(timeSearch.toLowerCase())
    );
  });

  const handleBookRide = (item) => {
    fetch("http://10.133.138.73:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rideId: item._id || item.id,
        driverName: item.driverName,
        from: item.from,
        to: item.to,
        date: item.date,
        time: item.time,
        vehicle: item.vehicle,
        seats: item.seats,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Booking request sent!");
          setBookedRides(prev => [...prev, {
            rideId: item._id || item.id,
            driverName: item.driverName,
            from: item.from,
            to: item.to,
            date: item.date,
            time: item.time,
            vehicle: item.vehicle,
            seats: item.seats,
          }]);
          navigation.navigate("View Booking Status");
        } else {
          alert("Booking failed: " + data.message);
        }
      })
      .catch(err => {
        console.error("Booking Error:", err);
        alert("Something went wrong, check console");
      });
  };

  const renderRide = ({ item }) => (
    <View style={styles.rideCard}>
      <View style={styles.driverInfo}>
        <TouchableOpacity onPress={() => handleDriverImagePress(item.driverName)}>
          <Image
            source={require('../../assets/images/Profileimage.png')}
            style={styles.driverImage}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.driverName}>{item.driverName}</Text>
        </View>
      </View>

      <Text style={styles.detail}>From: {item.from}</Text>
      <Text style={styles.detail}>To: {item.to}</Text>
      <Text style={styles.detail}>Date: {item.date}</Text>
      <Text style={styles.detail}>Time: {item.time}</Text>
      <Text style={styles.detail}>Vehicle: {item.vehicle}</Text>
      <Text style={styles.detail}>Seats: {item.seats}</Text>

      {/* Route stops chips */}
      {item.route && Array.isArray(item.route) && item.route.length > 0 && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeLabel}>
            🛣️ Route includes {item.route.length} stop{item.route.length > 1 ? 's' : ''}:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.routeStopsContainer}>
              {item.route.map((stop, index) => {
                const parsed = parseWaypoint(stop, index);
                const stopName = parsed ? parsed.name : `Stop ${index + 1}`;
                return (
                  <View key={index} style={styles.routeStop}>
                    <Text style={styles.routeStopText}>{stopName}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}

      <TouchableOpacity
        style={styles.routeButton}
        onPress={() => handleShowRoute(item)}
      >
        <Text style={styles.routeButtonText}>🗺️ View Route on Map</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => handleBookRide(item)}
      >
        <Text style={styles.bookButtonText}>Book Ride</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('Reviews', { driverName: item.driverName })}
      >
        <Text style={styles.bookButtonText}>Reviews</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#297ce9" />
        <Text style={styles.loadingText}>Loading rides...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputrow}>
        <TextInput
          style={styles.input}
          placeholder="From"
          value={fromSearch}
          onChangeText={setFromSearch}
        />
        <TextInput
          style={styles.input}
          placeholder="To"
          value={toSearch}
          onChangeText={setToSearch}
        />
      </View>

      <View style={styles.inputrow}>
        <TextInput
          style={styles.input}
          placeholder="Date YYYY-MM-DD"
          value={dateSearch}
          onChangeText={setDateSearch}
        />
        <TextInput
          style={styles.input}
          placeholder="Time 00:00 AM"
          value={timeSearch}
          onChangeText={setTimeSearch}
        />
      </View>

      <FlatList
        data={filteredRides}
        keyExtractor={(item) => item._id}
        renderItem={renderRide}
        ListEmptyComponent={<Text style={styles.noResult}>No rides found</Text>}
      />

      {/* ===== Driver Profile Modal ===== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showProfileModal}
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Driver Profile</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {profileLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading profile...</Text>
              </View>
            ) : (
              <>
                <View style={styles.imageSection}>
                  <Image source={driverImage} style={styles.profileImage} />
                </View>
                <Text style={styles.heading}>Driver Photo</Text>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.text}>{driverProfile.fullName}</Text>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.text}>{driverProfile.email}</Text>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.text}>{driverProfile.phone}</Text>
                <TouchableOpacity
                  style={styles.closeButtonStyle}
                  onPress={() => setShowProfileModal(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ===== Route Map Modal ===== */}
      <Modal
        animationType="slide"
        visible={showRouteModal}
        onRequestClose={() => setShowRouteModal(false)}
      >
        <View style={styles.routeModalContainer}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeTitle}>
              🗺️ {selectedRide?.from} → {selectedRide?.to}
            </Text>
            <TouchableOpacity onPress={() => setShowRouteModal(false)}>
              <Text style={styles.routeCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <MapView style={styles.map} region={mapRegion}>

            {/* Render all points as markers with correct colors */}
            {parsedRouteCoords.map((point, index) => {
              const isFirst = index === 0;
              const isLast = index === parsedRouteCoords.length - 1;
              const pinColor = isFirst ? 'green' : isLast ? 'red' : 'blue';
              const description = isFirst
                ? '🚀 Starting Point'
                : isLast
                ? '🏁 Destination'
                : `Waypoint ${index}`;

              return (
                <Marker
                  key={`marker-${index}`}
                  coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                  pinColor={pinColor}
                  title={point.name}
                  description={description}
                />
              );
            })}

            {/* Single Polyline through ALL points (from → waypoints → to) */}
            {parsedRouteCoords.length >= 2 && (
              <Polyline
                coordinates={parsedRouteCoords.map(p => ({
                  latitude: p.latitude,
                  longitude: p.longitude,
                }))}
                strokeColor="#297ce9"
                strokeWidth={4}
              />
            )}
          </MapView>

          {/* Waypoints summary strip */}
          {parsedRouteCoords.length > 2 && (
            <View style={styles.routeStripContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {parsedRouteCoords.map((point, index) => {
                  const isFirst = index === 0;
                  const isLast = index === parsedRouteCoords.length - 1;
                  const chipStyle = isFirst
                    ? styles.chipFrom
                    : isLast
                    ? styles.chipTo
                    : styles.chipWaypoint;
                  return (
                    <View key={`chip-${index}`} style={chipStyle}>
                      <Text style={styles.chipText}>
                        {isFirst ? '🟢 ' : isLast ? '🔴 ' : '🔵 '}
                        {point.name}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={styles.routeFooter}>
            <TouchableOpacity
              style={styles.routeCloseButtonStyle}
              onPress={() => setShowRouteModal(false)}
            >
              <Text style={styles.buttonText}>Close Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  inputrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.2,
    fontSize: 16,
    marginHorizontal: 5,
  },
  rideCard: {
    backgroundColor: '#eee9e7ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginVertical: 2
  },
  bookButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  bookButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  noResult: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555'
  },
  // --- Profile Modal ---
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  closeButton: {
    fontSize: 20,
    color: '#888'
  },
  imageSection: { alignItems: 'center' },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: '#08edf5ff',
  },
  heading: { fontSize: 13, textAlign: 'center', marginTop: 5 },
  label: { fontSize: 18, marginTop: 10, alignSelf: 'flex-start' },
  text: { fontSize: 16, color: '#777', marginBottom: 10, alignSelf: 'flex-start' },
  closeButtonStyle: {
    backgroundColor: '#269ee4ff',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '100%'
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  // --- Route info on card ---
  routeInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  routeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  routeStopsContainer: { flexDirection: 'row' },
  routeStop: {
    backgroundColor: '#297ce9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 8,
  },
  routeStopText: { color: '#fff', fontSize: 12 },
  routeButton: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#297ce9',
  },
  routeButtonText: {
    color: '#297ce9',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // --- Route Map Modal ---
  routeModalContainer: { flex: 1, backgroundColor: '#fff' },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  routeCloseButton: {
    fontSize: 20,
    color: '#888',
    paddingLeft: 10
  },
  map: { flex: 1 },
  // Route strip at bottom of map
  routeStripContainer: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  chipFrom: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  chipTo: {
    backgroundColor: '#ffebee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  chipWaypoint: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#297ce9',
  },
  chipText: { fontSize: 13, fontWeight: '600', color: '#333' },
  routeFooter: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  routeCloseButtonStyle: {
    backgroundColor: '#999',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  }
});

export default GetRide;