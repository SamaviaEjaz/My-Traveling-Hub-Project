import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatList = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [userType, setUserType] = useState(''); // 'passenger' ya 'driver'

  // User data load karna
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserType(parsedData.userType);
          
          // Abhi ke liye dummy data, baad mein API se data lena
          if (parsedData.userType === 'passenger') {
            // Passenger ko drivers dikhayein
            setChats([
              { id: '1', name: 'Driver Ahmed', lastMessage: 'I am available', time: '2:30 PM', type: 'driver' },
              { id: '2', name: 'Driver Ali', lastMessage: 'Where are you?', time: '1:45 PM', type: 'driver' },
            ]);
          } else {
            // Driver ko passengers dikhayein
            setChats([
              { id: '1', name: 'Passenger Moosa', lastMessage: 'Need a ride', time: '2:30 PM', type: 'passenger' },
              { id: '2', name: 'Passenger Khan', lastMessage: 'Are you coming?', time: '1:45 PM', type: 'passenger' },
            ]);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => navigation.navigate('Messages', { 
        name: item.name,
        userId: item.id,
        userType: item.type
      })}
    >
      <Image source={require('../../assets/images/Profileimage.png')} style={styles.profileImage} />
      <View style={styles.chatInfo}>
        <View style={styles.nameTimeRow}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {userType === 'driver' ? 'Passengers' : 'Drivers'}
      </Text>
      <FlatList 
        data={chats}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  item: {
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 1,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
});

export default ChatList;