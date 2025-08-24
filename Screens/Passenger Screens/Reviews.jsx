import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

const Reviews = () => {
  const route = useRoute();
  const { driverName } = route.params;

  const reviewsData = [
    { driverName: 'Muhammad Moosa', rating: 3.5, comment: 'Very polite and punctual driver.' },
    { driverName: 'Muhammad Moosa', rating: 4.0, comment: 'Good service but car was not very clean.' },
    { driverName: 'Ali Khan', rating: 3.7, comment: 'Average ride, but reached on time.' },
    { driverName: 'Ali Khan', rating: 4.2, comment: 'Friendly and professional.' },
  ];

  const filteredReviews = reviewsData.filter(
    (review) => review.driverName === driverName
  );

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push('★');
      } else if (i - rating < 1 && rating % 1 !== 0) {
        stars.push('⯨');
      } else {
        stars.push('☆');
      }
    }
    return stars.join(' ');
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.driverInfo}>
        <Image
          source={require('../../assets/images/Profileimage.png')}
          style={styles.driverImage}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.driverName}>{item.driverName}</Text>
          <Text style={styles.rating}>
            {renderStars(item.rating)} ({item.rating})
          </Text>
          <Text style={styles.comment}>{item.comment}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reviews for {driverName}</Text>
      {filteredReviews.length > 0 ? (
        <FlatList
          data={filteredReviews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderReview}
        />
      ) : (
        <Text style={styles.noReviews}>No reviews available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noReviews: {
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  reviewCard: {
    backgroundColor: '#eee9e7ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    fontSize: 16,
    color: '#ffaa00',
  },
  comment: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    maxWidth: 250
  },
});

export default Reviews;
