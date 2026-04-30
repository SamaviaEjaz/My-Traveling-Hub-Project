import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const Complaint = () => {
  const [complaints] = useState([
    { id: '1', user: 'Ali Khan', message: 'Driver ne late pick kiya.' },
    { id: '2', user: 'Sara Ahmed', message: 'Vehicle condition achi nahi thi.' },
    { id: '3', user: 'Usman Malik', message: 'Fare zyada charge kiya gaya.' },
  ]);

  const renderComplaint = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.userName}>{item.user}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Complaints</Text>

      {complaints.length === 0 ? (
        <Text style={styles.noComplaint}>No complaints received</Text>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id}
          renderItem={renderComplaint}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  noComplaint: { textAlign: 'center', fontSize: 16, color: '#999', marginTop: 20 },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  userName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  message: { fontSize: 14, color: '#555' }
});

export default Complaint;