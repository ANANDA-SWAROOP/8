import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { lightTheme, darkTheme } from './themes';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [conversations, setConversations] = useState([]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addConversation = (conversation) => {
    setConversations([...conversations, conversation]);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AppContainer>
        <Sidebar 
          conversations={conversations} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}
        />
        <ChatArea addConversation={addConversation} />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
