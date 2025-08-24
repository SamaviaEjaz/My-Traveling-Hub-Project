import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';

const SharePost = ({ navigation }) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [time, setTime] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [seats, setSeats] = useState('');
    const [note, setNote] = useState('');

    const [averageRating, setAverageRating] = useState(3.5);

    const handlePost = async () => {
        if (!from || !to || !dateTime || !time || !vehicle || !seats) {
            Alert.alert("Missing Fields", "Please fill all required fields.");
            return;
        }

        try {
            const res = await fetch("http://10.113.22.73:5000/api/rides", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    driverName: "Muhammad",
                    rating: averageRating,
                    from,
                    to,
                    date: dateTime,  
                    time,
                    vehicle,
                    seats,
                    note,
                }),
            });

            const data = await res.json();

            if (data.success) {
                Alert.alert("Success", "Ride shared successfully!");
                navigation.navigate('ViewSharedPost');
            } else {
                Alert.alert("Error", "Something went wrong while sharing the ride.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to connect to server.");
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(averageRating)) {
                stars.push('★');
            } else if (i - averageRating < 1 && averageRating % 1 !== 0) {
                stars.push('⯨');
            } else {
                stars.push('☆');
            }
        }
        return stars.join(' ');
    };

    return (
        <View style={styles.container}>
            <View style={styles.driverInfo}>
                <Image
                    source={require('../../assets/images/Profileimage.png')}
                    style={styles.driverImage}
                />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.driverName}>Muhammad</Text>
                    <Text style={styles.rating}>
                        {renderStars()} ({averageRating.toFixed(1)})
                    </Text>
                </View>
            </View>

            <Text style={styles.title}>Share a Ride</Text>

            <TextInput style={styles.input} placeholder="From" value={from} onChangeText={setFrom} />
            <TextInput style={styles.input} placeholder="To" value={to} onChangeText={setTo} />
            <TextInput style={styles.input} placeholder="Date" value={dateTime} onChangeText={setDateTime} />
            <TextInput style={styles.input} placeholder="Time" value={time} onChangeText={setTime} />
            <TextInput style={styles.input} placeholder="Vehicle Type" value={vehicle} onChangeText={setVehicle} />
            <TextInput style={styles.input} placeholder="Available Seats" keyboardType="numeric" value={seats} onChangeText={setSeats} />
            <TextInput style={styles.input} placeholder="Notes (optional)" value={note} onChangeText={setNote} />

            <TouchableOpacity style={styles.button} onPress={handlePost}>
                <Text style={styles.buttontext}>Share Post</Text>
            </TouchableOpacity>
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
    rating: {
        fontSize: 18,
        color: '#ffaa00',
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
});

export default SharePost;
