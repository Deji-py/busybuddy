import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/context/theme-provider';
import { Send } from 'lucide-react-native';

import BusyBot from '@/assets/busybot.svg';

// Types
type MessageRole = 'user' | 'assistant';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// Message Item Component
const MessageItem: React.FC<{
  message: Message;
  theme: any;
  styles: any;
}> = ({ message, theme, styles }) => {
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.messageWrapper,
        isUser ? styles.userMessageWrapper : styles.assistantMessageWrapper,
      ]}>
      {!isUser && <BusyBot width={20} height={20} style={{ marginRight: 8, marginTop: 4 }} />}
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.assistantMessageText,
          ]}>
          {message.content}
        </Text>
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.assistantTimestamp]}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
};

// Create dynamic styles using theme
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.cardBorder,
    },
    headerTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: '600',
      color: theme.colors.primaryForeground,
    },
    messagesContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    messageWrapper: {
      marginVertical: theme.spacing.xs,
      flexDirection: 'row',
    },
    userMessageWrapper: {
      justifyContent: 'flex-end',
    },
    assistantMessageWrapper: {
      justifyContent: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.lg,
    },
    userBubble: {
      backgroundColor: theme.colors.primary,
    },
    assistantBubble: {
      backgroundColor: theme.colors.muted,
    },
    messageText: {
      fontSize: theme.typography.body.fontSize,
      marginBottom: theme.spacing.xs,
      lineHeight: 24,
    },
    userMessageText: {
      color: theme.colors.primaryForeground,
    },
    assistantMessageText: {
      color: theme.colors.foreground,
    },
    timestamp: {
      fontSize: theme.typography.xtraSmall.fontSize,
      marginTop: theme.spacing.xs,
    },
    userTimestamp: {
      color: `${theme.colors.primaryForeground}80`,
    },
    assistantTimestamp: {
      color: theme.colors.mutedForeground,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyStateTitle: {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: '600',
      color: theme.colors.foreground,
      marginBottom: theme.spacing.md,
    },
    emptyStateText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.mutedForeground,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    loadingText: {
      fontSize: theme.typography.small.fontSize,
      color: theme.colors.mutedForeground,
    },
    inputContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.background,
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'flex-end',
    },
    inputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: theme.colors.muted,
      borderRadius: 20,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderColor: theme.colors.border,
    },
    inputWrapperFocused: {
      borderColor: theme.colors.primary,
    },
    input: {
      flex: 1,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.foreground,
      paddingVertical: 0,
      maxHeight: 120,
      minHeight: 60,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
    content: {
      flex: 1,
      maxHeight: 600,
    },
  });

const StudyView: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Simulate AI response
  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      `I understand you said: "${userMessage}". This is a dummy response for testing purposes.`,
      `That's interesting! You mentioned "${userMessage}". How can I help you further?`,
      `I see. You're asking about "${userMessage}". Let me think about that...`,
      `Great question! Regarding "${userMessage}", let me provide some insights.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    Keyboard.dismiss();

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: generateAIResponse(currentInput),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 800);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageItem message={item} theme={theme} styles={styles} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Start a Conversation</Text>
      <Text style={styles.emptyStateText}>Send a message to begin chatting</Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.primary} size="small" />
        <Text style={styles.loadingText}>AI is thinking...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Messages Container */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
        }}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        scrollEventThrottle={16}
      />

      {/* Input Container */}
      <View
        style={{
          backgroundColor: theme.colors.background,
        }}>
        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, inputFocused && styles.inputWrapperFocused]}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Type your message..."
              placeholderTextColor={theme.colors.mutedForeground}
              multiline
              maxLength={1000}
              textAlignVertical="top"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputValue.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              activeOpacity={0.7}>
              <Send size={20} color={theme.colors.primaryForeground} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StudyView;
