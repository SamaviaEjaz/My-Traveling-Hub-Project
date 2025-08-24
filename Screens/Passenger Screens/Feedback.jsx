import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { SafeAreaView } from 'react-native-safe-area-context';

const Feedback = () => {
    const navigation = useNavigation();
  
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Rating
          type="star"
          ratingCount={5}
          imageSize={40}
          showRating
          startingValue={rating}
          onFinishRating={(value) => setRating(value)}
          style={{ paddingVertical: 10 }}
        />

        <TextInput
          style={styles.input}
          placeholder="Write your comment"
          value={comment}
          onChangeText={setComment}/>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttontext}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2,
    marginBottom: 5,
    paddingHorizontal: 15,
    borderRadius: 3,
    backgroundColor: '#FFF',
    fontSize: 16,
    color: '#333',
    margin: 15,
  },
  button: {
    backgroundColor: '#1215efff',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 60,
    marginTop: 15,
  },
  buttontext: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Feedback;
