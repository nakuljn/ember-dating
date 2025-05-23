import api from './apiClient';

/**
 * Chat API service
 */
class ChatAPI {
  /**
   * Get messages for a match
   * @param {string} matchId - ID of the match
   * @returns {Promise} Messages data
   */
  async getMessages(matchId) {
    try {
      const response = await api.get(`/matches/${matchId}/messages`);
      return response.data.messages;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  /**
   * Create a WebSocket connection for real-time chat
   * @param {string} userId - Current user's ID
   * @param {Function} onMessage - Callback for new messages
   * @param {Function} onReadReceipt - Callback for read receipts
   * @returns {WebSocket} WebSocket connection object
   */
  createChatConnection(userId, onMessage, onReadReceipt) {
    try {
      // Get backend URL from API client
      const baseUrl = api.defaults.baseURL.replace('http', 'ws');
      const wsUrl = `${baseUrl}/ws/chat/${userId}`;
      
      // Create WebSocket connection
      const ws = new WebSocket(wsUrl);
      
      // WebSocket event handlers
      ws.onopen = () => {
        console.log('WebSocket connection established');
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Call appropriate callback based on event type
        if (data.event_type === 'message' && onMessage) {
          onMessage(data.payload);
        } else if (data.event_type === 'read_receipt' && onReadReceipt) {
          onReadReceipt(data.payload);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
      
      return ws;
    } catch (error) {
      console.error('Create chat connection error:', error);
      throw error;
    }
  }

  /**
   * Send a message through WebSocket
   * @param {WebSocket} ws - WebSocket connection
   * @param {string} matchId - ID of the match
   * @param {string} content - Message content
   * @returns {boolean} Success status
   */
  sendMessage(ws, matchId, content) {
    try {
      if (ws.readyState !== WebSocket.OPEN) {
        throw new Error('WebSocket is not connected');
      }
      
      const message = {
        event_type: 'message',
        payload: {
          match_id: matchId,
          content: content,
          sent_at: new Date().toISOString()
        }
      };
      
      ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  /**
   * Send read receipt through WebSocket
   * @param {WebSocket} ws - WebSocket connection
   * @param {string} messageId - ID of the message that was read
   * @returns {boolean} Success status
   */
  sendReadReceipt(ws, messageId) {
    try {
      if (ws.readyState !== WebSocket.OPEN) {
        throw new Error('WebSocket is not connected');
      }
      
      const readReceipt = {
        event_type: 'read_receipt',
        payload: {
          message_id: messageId,
          read_at: new Date().toISOString()
        }
      };
      
      ws.send(JSON.stringify(readReceipt));
      return true;
    } catch (error) {
      console.error('Send read receipt error:', error);
      throw error;
    }
  }
}

export default new ChatAPI(); 