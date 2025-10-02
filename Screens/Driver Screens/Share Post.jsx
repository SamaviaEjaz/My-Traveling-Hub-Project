import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, Modal, FlatList, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const SharePost = ({ navigation }) => {
  const route = useRoute();
  const driverName = route.params?.driverName || "Ahsan";

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [time, setTime] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [seats, setSeats] = useState('');
  
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [showSeatsPicker, setShowSeatsPicker] = useState(false);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
    'Hyderabad', 'Sukkur', 'Larkana', 'Mardan', 'Mingora',
    'Abbottabad', 'Bahawalpur', 'Sargodha', 'Gujrat', 'Sheikhupura',
    'Jhang', 'Rahim Yar Khan', 'Sahiwal', 'Okara', 'Wah Cantonment',
    'Dera Ghazi Khan', 'Mirpur Khas', 'Nawabshah', 'Kamoke', 'Muzaffargarh',
    'Chiniot', 'Mandi Bahauddin', 'Shikarpur', 'Lodhran', 'Jhelum',
    'Gilgit', 'Skardu', 'Murree', 'Swat', 'Kaghan',
    'Hunza', 'Chitral', 'Khunjerab Pass', 'Naltar Valley', 'Fairy Meadows'
  ];
  
  const seatsOptions = Array.from({length: 30}, (_, i) => (i + 1).toString());

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const date = selectedDate;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      setSelectedDate(date);
      setDateTime(`${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const time = selectedTime;
      const hours = time.getHours();
      const minutes = time.getMinutes();
      setSelectedTime(time);
      setTime(`${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`);
    }
  };

  const handlePost = async () => {
    try {
      const checkRes = await fetch("http://10.101.99.73:5000/api/rides");
      const checkData = await checkRes.json();

      const existing = checkData.rides.find(r => r.driverName === driverName);
      if (existing) {
        Alert.alert("Already Shared", "You already have a shared ride. Please delete it before sharing a new Post.");
        return;
      }

      const url = "http://10.101.99.73:5000/api/rides";
      const res = await fetch(url, {
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
        }),
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Ride shared successfully!");
        navigation.navigate("ViewSharedPost");
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to connect to server.");
    }
  };

  const renderDropdownItem = (item, setSelected, setShowPicker) => (
    <TouchableOpacity 
      style={styles.dropdownItem} 
      onPress={() => {
        setSelected(item);
        setShowPicker(false);
      }}
    >
      <Text style={styles.dropdownItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.driverInfo}>
        <Image
          source={require('../../assets/images/Profileimage.png')}
          style={styles.driverImage}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.driverName}>{driverName}</Text>
        </View>
      </View>

      <Text style={styles.title}>Share a Ride</Text>

      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowFromPicker(true)}
      >
        <Text style={from ? styles.inputText : styles.placeholderText}>
          {from || "From (Pakistan)"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowToPicker(true)}
      >
        <Text style={to ? styles.inputText : styles.placeholderText}>
          {to || "To (Pakistan)"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={dateTime ? styles.inputText : styles.placeholderText}>
          {dateTime || "Select Date"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={time ? styles.inputText : styles.placeholderText}>
          {time || "Select Time"}
        </Text>
      </TouchableOpacity>

      <TextInput 
        style={styles.input} 
        placeholder="Vehicle Type" 
        value={vehicle} 
        onChangeText={setVehicle} 
      />
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowSeatsPicker(true)}
      >
        <Text style={seats ? styles.inputText : styles.placeholderText}>
          {seats ? `${seats} Seats` : "Available Seats"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Text style={styles.buttontext}>Share Post</Text>
      </TouchableOpacity>

      <Modal visible={showFromPicker} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Departure City</Text>
            <FlatList
              data={cities}
              keyExtractor={(item) => item}
              renderItem={({item}) => renderDropdownItem(item, setFrom, setShowFromPicker)}
            />
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowFromPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showToPicker} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Destination City</Text>
            <FlatList
              data={cities}
              keyExtractor={(item) => item}
              renderItem={({item}) => renderDropdownItem(item, setTo, setShowToPicker)}
            />
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowToPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showSeatsPicker} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Available Seats</Text>
            <FlatList
              data={seatsOptions}
              keyExtractor={(item) => item}
              renderItem={({item}) => renderDropdownItem(item, setSeats, setShowSeatsPicker)}
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


      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2,
    marginBottom: 3,
    paddingHorizontal: 15,
    borderRadius: 3,
    backgroundColor: '#FFF',
    fontSize: 16,
    color: '#333',
    margin: 5,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  button: {
    backgroundColor: '#297ce9a3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
    margin: 5,
  },
  buttontext: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#297ce9',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SharePost;