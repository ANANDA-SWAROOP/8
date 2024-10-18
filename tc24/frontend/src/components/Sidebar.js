import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: ${props => props.theme.sidebarBackground};
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const NewConversationButton = styled.button`
  background-color: ${props => props.theme.buttonBackground};
  color: ${props => props.theme.buttonText};
  border: none;
  padding: 10px;
  margin-bottom: 20px;
  cursor: pointer;
`;

const ConversationList = styled.div`
  flex-grow: 1;
`;

const Conversation = styled.div`
  padding: 10px;
  margin-bottom: 5px;
  background-color: ${props => props.theme.conversationBackground};
`;

const Settings = styled.div`
  margin-top: 20px;
`;

const Setting = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${Slider} {
    background-color: #2196F3;
  }

  &:checked + ${Slider}:before {
    transform: translateX(20px);
  }
`;

function Sidebar({ conversations, isDarkMode, toggleDarkMode }) {
  return (
    <SidebarContainer>
      <NewConversationButton>+ New Conversation</NewConversationButton>
      <ConversationList>
        {conversations.map((conversation, index) => (
          <Conversation key={index}>{conversation.code.substring(0, 20)}...</Conversation>
        ))}
      </ConversationList>
      <Settings>
        <Setting>
          <span>Dark Mode</span>
          <Switch>
            <Input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
            <Slider />
          </Switch>
        </Setting>
      </Settings>
    </SidebarContainer>
  );
}

export default Sidebar;
