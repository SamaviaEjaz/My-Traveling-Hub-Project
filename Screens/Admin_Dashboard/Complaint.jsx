import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const SERVER_URL = "http://10.101.99.73:5000/api";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/complaints`);
      setComplaints(res.data.complaints);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.driverName}>Driver: {item.driverName}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Complaints</Text>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noComplaint}>No complaints</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center'
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333'
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginTop: 5
  },
  noComplaint: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16
  }
});

export default AdminComplaints;
