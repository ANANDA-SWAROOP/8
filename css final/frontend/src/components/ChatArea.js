import React, { useState } from 'react';
import styled from 'styled-components';
import CodeInput from './CodeInput';
import axios from 'axios';

const ChatAreaContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const Message = styled.div`
  margin-bottom: 20px;
  display: flex;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.avatarBackground};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const Content = styled.div`
  background-color: ${props => props.theme.messageBackground};
  padding: 10px;
  border-radius: 5px;
  max-width: 70%;
`;

function ChatArea({ addConversation }) {
  const [messages, setMessages] = useState([]);

  const handleCodeSubmit = async (code) => {
    try {
      const response = await axios.post('http://localhost:5000/analyze', { code });
      const newMessage = {
        type: 'bot',
        content: `
          Language: ${response.data.language}
          Corrected Code: ${response.data.corrected_code}
          Warnings: ${response.data.warnings.join(', ')}
          Vulnerabilities: ${response.data.vulnerabilities.join(', ')}
        `
      };
      setMessages([...messages, { type: 'user', content: code }, newMessage]);
      addConversation({ code, response: newMessage.content });
    } catch (error) {
      console.error('Error analyzing code:', error);
    }
  };

  return (
    <ChatAreaContainer>
      <MessagesContainer>
        {messages.map((message, index) => (
          <Message key={index}>
            <Avatar>{message.type === 'user' ? '👤' : '🤖'}</Avatar>
            <Content>{message.content}</Content>
          </Message>
        ))}
      </MessagesContainer>
      <CodeInput onSubmit={handleCodeSubmit} />
    </ChatAreaContainer>
  );
}

export default ChatArea;

