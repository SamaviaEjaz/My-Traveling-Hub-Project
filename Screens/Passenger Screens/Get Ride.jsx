// GetRide.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
};

const GetRide = ({ navigation }) => {
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');
  const [timeSearch, setTimeSearch] = useState('');
  const [rides, setRides] = useState([]);
  const [bookedRides, setBookedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [parsedRouteCoords, setParsedRouteCoords] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 30.3753, longitude: 69.3451, latitudeDelta: 10, longitudeDelta: 10,
  });

  useEffect(() => {
    fetchRides();
    fetchBookedRides();
  }, []);

  const fetchRides = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/rides`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
      .then(res => res.text())
      .then(text => {
        console.log('Rides response:', text.substring(0, 100));
        const data = JSON.parse(text);
        setRides(data.rides || []);
        setLoading(false);
      })
      .catch(err => { console.error('Error fetching rides:', err); setLoading(false); });
  };

  const fetchBookedRides = () => {
    fetch(`${BASE_URL}/api/bookings`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBookedRides(data);
      })
      .catch(err => console.log('fetchBookedRides error:', err));
  };

  const getCityCoordinates = (locationName) => {
    if (!locationName) return null;
    const cityName = locationName.toLowerCase().trim();
    if (CITY_COORDINATES[cityName]) return CITY_COORDINATES[cityName];
    for (const city in CITY_COORDINATES) {
      if (city.includes(cityName) || cityName.includes(city)) return CITY_COORDINATES[city];
    }
    return null;
  };

  const parseWaypoint = (waypoint, index) => {
    if (!waypoint) return null;
    if (typeof waypoint === 'object') {
      const lat = parseFloat(waypoint.latitude);
      const lng = parseFloat(waypoint.longitude);
      if (!isNaN(lat) && !isNaN(lng)) return { latitude: lat, longitude: lng, name: waypoint.name || `Stop ${index + 1}` };
      if (waypoint.name) {
        const coords = getCityCoordinates(waypoint.name);
        if (coords) return { ...coords, name: waypoint.name };
      }
    }
    if (typeof waypoint === 'string' && waypoint.trim()) {
      const coords = getCityCoordinates(waypoint.trim());
      if (coords) return { ...coords, name: waypoint.trim() };
    }
    return null;
  };

  const buildRoutePoints = (ride) => {
    if (!ride) return [];
    const points = [];
    if (ride.fromLocation && !isNaN(parseFloat(ride.fromLocation.latitude))) {
      points.push({ latitude: parseFloat(ride.fromLocation.latitude), longitude: parseFloat(ride.fromLocation.longitude), name: ride.fromLocation.name || ride.from });
    } else {
      const coords = getCityCoordinates(ride.from);
      if (coords) points.push({ ...coords, name: ride.from });
    }
    if (Array.isArray(ride.route) && ride.route.length > 0) {
      ride.route.forEach((wp, i) => { const parsed = parseWaypoint(wp, i); if (parsed) points.push(parsed); });
    }
    if (ride.toLocation && !isNaN(parseFloat(ride.toLocation.latitude))) {
      points.push({ latitude: parseFloat(ride.toLocation.latitude), longitude: parseFloat(ride.toLocation.longitude), name: ride.toLocation.name || ride.to });
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
    setMapRegion({
      latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
      longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
      latitudeDelta: Math.max((Math.max(...lats) - Math.min(...lats)) * 1.5, 1),
      longitudeDelta: Math.max((Math.max(...lngs) - Math.min(...lngs)) * 1.5, 1),
    });
  };

  const handleShowRoute = (ride) => {
    const points = buildRoutePoints(ride);
    if (points.length === 0) { alert('No route data available.'); return; }
    setSelectedRide(ride);
    setParsedRouteCoords(points);
    fitMapToPoints(points);
    setShowRouteModal(true);
  };

  const handleBookRide = async (item) => {
    console.log('🚀 Book ride pressed:', item.driverName);

    const passengerName = await AsyncStorage.getItem('passengerName') || 'Anonymous';
    const passengerPhone = await AsyncStorage.getItem('passengerPhone') || 'Not provided';
    console.log('👤 Passenger:', passengerName, passengerPhone);

    let driverPhone = 'Not provided';
    let driverEmail = 'Not provided';
    try {
      const cached = await AsyncStorage.getItem(`driverProfile_${item.driverName}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        driverPhone = parsed.phone || 'Not provided';
        driverEmail = parsed.email || 'Not provided';
        console.log('🚗 Driver from cache:', driverPhone, driverEmail);
      } else {
        const res = await fetch(`${BASE_URL}/api/drivers?name=${item.driverName}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        const text = await res.text();
        console.log('🚗 Driver API response:', text.substring(0, 100));
        const result = JSON.parse(text);
        if (result.success && result.drivers?.length > 0) {
          driverPhone = result.drivers[0].phone || 'Not provided';
          driverEmail = result.drivers[0].email || 'Not provided';
        }
      }
    } catch (e) {
      console.log('Driver info fetch error:', e);
    }

    const bookingData = {
      rideId: item._id || item.id,
      driverName: item.driverName,
      driverPhone,
      driverEmail,
      from: item.from,
      to: item.to,
      date: item.date,
      time: item.time,
      vehicle: item.vehicle,
      seats: item.seats,
      passengerName,
      passengerPhone,
    };
    console.log('📦 Sending booking:', JSON.stringify(bookingData));

    fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(bookingData),
    })
      .then(res => {
        console.log('📡 Status:', res.status);
        return res.text();
      })
      .then(text => {
        console.log('📡 Response:', text.substring(0, 200));
        const data = JSON.parse(text);
        if (data.success) {
          alert("Booking request sent!");
          setBookedRides(prev => [...prev, { rideId: item._id || item.id, ...item }]);
          navigation.navigate("View Booking Status");
        } else {
          alert("Booking failed: " + data.message);
        }
      })
      .catch(err => {
        console.error("Booking Error:", err);
        alert("Something went wrong: " + err.message);
      });
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

  const renderRide = ({ item }) => (
    <View style={styles.rideCard}>
      <View style={styles.driverInfo}>
        <Image source={require('../../assets/images/Profileimage.png')} style={styles.driverImage} />
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
      {item.route && Array.isArray(item.route) && item.route.length > 0 && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeLabel}>🛣️ Route includes {item.route.length} stop{item.route.length > 1 ? 's' : ''}:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.routeStopsContainer}>
              {item.route.map((stop, index) => {
                const parsed = parseWaypoint(stop, index);
                return (
                  <View key={index} style={styles.routeStop}>
                    <Text style={styles.routeStopText}>{parsed ? parsed.name : `Stop ${index + 1}`}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
      <TouchableOpacity style={styles.routeButton} onPress={() => handleShowRoute(item)}>
        <Text style={styles.routeButtonText}>🗺️ View Route on Map</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bookButton} onPress={() => handleBookRide(item)}>
        <Text style={styles.bookButtonText}>Book Ride</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.reviewsButton} onPress={() => navigation.navigate('DriversReviews', { driverName: item.driverName })}>
        <Text style={styles.bookButtonText}>Reviews</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#297ce9" />
      <Text style={styles.loadingText}>Loading rides...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputrow}>
        <TextInput style={styles.input} placeholder="From" value={fromSearch} onChangeText={setFromSearch} />
        <TextInput style={styles.input} placeholder="To" value={toSearch} onChangeText={setToSearch} />
      </View>
      <View style={styles.inputrow}>
        <TextInput style={styles.input} placeholder="Date YYYY-MM-DD" value={dateSearch} onChangeText={setDateSearch} />
        <TextInput style={styles.input} placeholder="Time 00:00 AM" value={timeSearch} onChangeText={setTimeSearch} />
      </View>

      <FlatList
        data={filteredRides}
        keyExtractor={(item) => item._id}
        renderItem={renderRide}
        ListEmptyComponent={<Text style={styles.noResult}>No rides found</Text>}
      />

      <Modal animationType="slide" visible={showRouteModal} onRequestClose={() => setShowRouteModal(false)}>
        <View style={styles.routeModalContainer}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeTitle}>🗺️ {selectedRide?.from} → {selectedRide?.to}</Text>
            <TouchableOpacity onPress={() => setShowRouteModal(false)}>
              <Text style={styles.routeCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <MapView style={styles.map} region={mapRegion}>
            {parsedRouteCoords.map((point, index) => {
              const isFirst = index === 0;
              const isLast = index === parsedRouteCoords.length - 1;
              return (
                <Marker
                  key={`marker-${index}`}
                  coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                  pinColor={isFirst ? 'green' : isLast ? 'red' : 'blue'}
                  title={point.name}
                  description={isFirst ? '🚀 Starting Point' : isLast ? '🏁 Destination' : `Waypoint ${index}`}
                />
              );
            })}
            {parsedRouteCoords.length >= 2 && (
              <Polyline
                coordinates={parsedRouteCoords.map(p => ({ latitude: p.latitude, longitude: p.longitude }))}
                strokeColor="#297ce9"
                strokeWidth={4}
              />
            )}
          </MapView>
          {parsedRouteCoords.length > 2 && (
            <View style={styles.routeStripContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {parsedRouteCoords.map((point, index) => {
                  const isFirst = index === 0;
                  const isLast = index === parsedRouteCoords.length - 1;
                  return (
                    <View key={`chip-${index}`} style={isFirst ? styles.chipFrom : isLast ? styles.chipTo : styles.chipWaypoint}>
                      <Text style={styles.chipText}>{isFirst ? '🟢 ' : isLast ? '🔴 ' : '🔵 '}{point.name}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
          <View style={styles.routeFooter}>
            <TouchableOpacity style={styles.routeCloseButtonStyle} onPress={() => setShowRouteModal(false)}>
              <Text style={styles.buttonText}>Close Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  inputrow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  input: { flex: 1, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, borderWidth: 0.2, fontSize: 16, marginHorizontal: 5 },
  rideCard: { backgroundColor: '#eee9e7ff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  driverInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  driverImage: { width: 60, height: 60, borderRadius: 30 },
  driverName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  detail: { fontSize: 16, color: '#555', marginVertical: 2 },
  bookButton: { backgroundColor: '#007bff', paddingVertical: 10, borderRadius: 8, marginTop: 10 },
  reviewsButton: { backgroundColor: '#6d6fc2ff', paddingVertical: 10, borderRadius: 8, marginTop: 10 },
  bookButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  noResult: { textAlign: 'center', color: '#888', marginTop: 20, fontSize: 16 },
  loadingText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#555' },
  routeInfo: { marginTop: 10, padding: 10, backgroundColor: '#f0f8ff', borderRadius: 8 },
  routeLabel: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  routeStopsContainer: { flexDirection: 'row' },
  routeStop: { backgroundColor: '#297ce9', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, marginRight: 8 },
  routeStopText: { color: '#fff', fontSize: 12 },
  routeButton: { backgroundColor: '#e3f2fd', paddingVertical: 10, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#297ce9' },
  routeButtonText: { color: '#297ce9', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  routeModalContainer: { flex: 1, backgroundColor: '#fff' },
  routeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#f8f8f8', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  routeTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1 },
  routeCloseButton: { fontSize: 20, color: '#888', paddingLeft: 10 },
  map: { flex: 1 },
  routeStripContainer: { backgroundColor: '#f8f9fa', paddingVertical: 10, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: '#ddd' },
  chipFrom: { backgroundColor: '#e8f5e9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#4caf50' },
  chipTo: { backgroundColor: '#ffebee', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#f44336' },
  chipWaypoint: { backgroundColor: '#e3f2fd', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#297ce9' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#333' },
  routeFooter: { padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  routeCloseButtonStyle: { backgroundColor: '#999', padding: 16, borderRadius: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default GetRide;