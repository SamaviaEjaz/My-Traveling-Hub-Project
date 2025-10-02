import React, { useEffect, useRef, useState } from 'react';
import {  FlatList,  Keyboard,  KeyboardAvoidingView,   Platform, StyleSheet,  Text,   TextInput,   TouchableOpacity,  TouchableWithoutFeedback, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PassengerMessages = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello', sender: 'other' },
    { id: '2', text: 'Hai', sender: 'me' },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
      console.log('Scrolled to end');
    }
  }, [messages]);

  const sendMessage = () => {
    console.log('Send button pressed:', inputText);
    if (inputText.trim() === '') {
      console.log('Input is empty, ignoring send');
      return;
    }
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
    };
    setMessages(prevMessages => {
      const updated = [...prevMessages, newMessage];
      console.log('Added message:', newMessage);
      return updated;
    });
    setInputText('');
    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        text: 'Got it!',
        sender: 'other',
      };
      setMessages(prevMessages => {
        const updated = [...prevMessages, reply];
        console.log('Added reply:', reply);
        return updated;
      });
    }, 2000);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.messagesContainer}
              keyboardShouldPersistTaps="handled"
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                returnKeyType="send"
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PassengerMessages;