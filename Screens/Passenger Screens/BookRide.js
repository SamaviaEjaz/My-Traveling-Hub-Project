import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";

const BookRide = ({ navigation }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [driverName, setDriverName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [seats, setSeats] = useState("");

  const handleBooking = async () => {
    try {
      const res = await axios.post("http://10.131.236.73:5000/api/bookings", {
        rideId: "123abc",   // Can generate dynamically
        driverName,
        from,
        to,
        date,
        time,
        vehicle,
        seats
      });
      if (res.data.success) {
        Alert.alert("Success", "Booking created!");
        navigation.navigate("ViewBookingStatus", { newBooking: res.data.booking });
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Driver Name" value={driverName} onChangeText={setDriverName} style={styles.input} />
      <TextInput placeholder="From" value={from} onChangeText={setFrom} style={styles.input} />
      <TextInput placeholder="To" value={to} onChangeText={setTo} style={styles.input} />
      <TextInput placeholder="Date" value={date} onChangeText={setDate} style={styles.input} />
      <TextInput placeholder="Time" value={time} onChangeText={setTime} style={styles.input} />
      <TextInput placeholder="Vehicle" value={vehicle} onChangeText={setVehicle} style={styles.input} />
      <TextInput placeholder="Seats" value={seats} onChangeText={setSeats} style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Book Ride</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: { height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 8, marginBottom: 10, paddingHorizontal: 10 },
  button: { backgroundColor: "#007bff", padding: 16, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});

export default BookRide;
