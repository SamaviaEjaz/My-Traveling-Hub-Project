import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Pending = () => {
    const navigation = useNavigation();

    // Header configuration with default back arrow
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Pending Approval',
            headerStyle: {
                backgroundColor: '#f2f2f2',
            },
            headerTintColor: '#333',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            // Default back arrow automatically shown when:
            // 1. Screen is not first in stack
            // 2. headerBackVisible is true (default)
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Your registration is pending approval.</Text>
            <Text style={styles.subtext}>We will notify you once your account is approved.</Text>
            <View style={{ position: 'absolute', bottom: 50, right: 30, }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Driver_Dashboard')}>
                    <Text style={styles.buttontext}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        padding: 20,
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtext: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    buttontext: {
        color: 'blue',
        fontSize: 18,
    },
});

export default Pending;