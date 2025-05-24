import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform as RNPlatform,
  Image
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../utils/theme';
import { chatAPI } from '../../services/api';

const ChatScreen = ({ route, navigation }) => {
  const { matchId, matchName } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (matchName) {
      navigation.setOptions({
        title: matchName,
      });
    }
    loadMessages();
  }, [matchId, matchName]);

  const loadMessages = () => {
    setIsLoading(true);
    // Mock messages for the MVP
    const mockMessages = [
      {
        id: '1',
        senderId: 'other',
        content: 'Hi there! How are you?',
        sentAt: new Date(Date.now() - 60000 * 60).toISOString(),
        readAt: new Date().toISOString(),
      },
      {
        id: '2',
        senderId: 'me',
        content: 'Hey! I\'m good, thanks for asking. How about you?',
        sentAt: new Date(Date.now() - 60000 * 30).toISOString(),
        readAt: null,
      },
      {
        id: '3',
        senderId: 'other',
        content: 'I\'m doing great! I saw that we both like hiking. What\'s your favorite trail?',
        sentAt: new Date(Date.now() - 60000 * 15).toISOString(),
        readAt: null,
      },
    ];
    
    setMessages(mockMessages);
    setIsLoading(false);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add new message to the list (client-side only for MVP)
    const newMessageObj = {
      id: Date.now().toString(),
      senderId: 'me',
      content: newMessage,
      sentAt: new Date().toISOString(),
      readAt: null,
    };
    
    setMessages([...messages, newMessageObj]);
    setNewMessage('');
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === 'me';
    
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessage : styles.theirMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.theirMessageText
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime,
            isMyMessage ? styles.myMessageTime : styles.theirMessageTime
          ]}>
            {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={RNPlatform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={RNPlatform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesList: {
    padding: SPACING.medium,
  },
  messageContainer: {
    marginBottom: SPACING.medium,
    flexDirection: 'row',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  theirMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.medium,
    borderRadius: 16,
  },
  myMessageBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: COLORS.cardBackground,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: TYPOGRAPHY.fontSize.regular,
  },
  myMessageText: {
    color: COLORS.textLight,
  },
  theirMessageText: {
    color: COLORS.textPrimary,
  },
  messageTime: {
    fontSize: TYPOGRAPHY.fontSize.tiny,
    marginTop: SPACING.tiny,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  theirMessageTime: {
    color: COLORS.textTertiary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SPACING.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: SPACING.small,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: SPACING.medium,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: COLORS.textLight,
    fontWeight: '600',
  },
});

export default ChatScreen; 