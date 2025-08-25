import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const ViewRegisteredDriver = () => {
  const drivers = [
    {
      id: '1',
      name: 'Ali Khan',
      email: 'ali@example.com',
      phone: '03001234567',
      CNIC: '3520212345671',
    },
    {
      id: '2',
      name: 'Sara Ahmed',
      email: 'sara@example.com',
      phone: '03009876543',
      CNIC: '3520212345672',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Registered Drivers</Text>

      {drivers.map((driver) => (
        
        <View key={driver.id} style={styles.card}>
          <View>
            <Text style={styles.label}>Name: <Text style={styles.value}>{driver.name}</Text></Text>
            <Text style={styles.label}>Email: <Text style={styles.value}>{driver.email}</Text></Text>
            <Text style={styles.label}>Phone: <Text style={styles.value}>{driver.phone}</Text></Text>
            <Text style={styles.label}>CNIC: <Text style={styles.value}>{driver.CNIC}</Text></Text>
          </View>
          <View>
            <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableOpacity >
                <Text style={{marginTop: 15}}>Approved</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={{color: 'white'}}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7f7f7'
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3
  },
  label: {
    fontWeight: 'bold',
    color: '#333'
  },
  value: {
    fontWeight: 'normal',
    color: '#555'
  },
    button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#cf1212ad',
    marginLeft: 150,
  },
});

export default ViewRegisteredDriver;