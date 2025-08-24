import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';



const Home = () => {
  const navigation = useNavigation();

  return (
    <View>
      <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Get Ride')}>
        <Text style={styles.buttontext}>View Post</Text>
      </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('View Booking Status')}>
        <Text style={styles.buttontext}>View booking Sattus</Text>
      </TouchableOpacity>

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#589af1ff',
    padding: 40,
    borderRadius: 15,
    margin: 15,
    marginVertical: 5,

  },
  buttontext: {
  color: 'white',
  fontSize: 20,
  fontWeight: 'bold',
},
});
export default Home;