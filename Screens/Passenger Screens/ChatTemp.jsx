import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const data = [
    { id: 1, title: 'Muhammad Moosa', lastMessage: 'Hello, how are you?', time: '2:30 PM' },
    { id: 2, title: 'Ali Khan', lastMessage: 'See you tomorrow!', time: '1:45 PM' },
];
  
const ChatTemp = () => {
  const navigation = useNavigation();
  const renderItem = ({item}) => (
<TouchableOpacity 
      style={styles.item}
      onPress={() => navigation.navigate('Messages', { title: item.title })}>
      <Image source={require('../../assets/images/Profileimage.png')} style={styles.profileImage} />
      <View style={styles.chatInfo}>
        <View style={styles.nameTimeRow}>
          <Text style={styles.itemText}>{item.title}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
    <FlatList 
    data ={data}
    renderItem={renderItem}
    keyExtractor = {item => item.id}
    />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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

export default ChatTemp;