import React, { useState } from 'react';
import styled from 'styled-components';

const InputArea = styled.div`
  display: flex;
  padding: 20px;
`;

const TextArea = styled.textarea`
  flex-grow: 1;
  padding: 10px;
  border: none;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.inputText};
  resize: vertical;
  min-height: 100px;
`;

const SendButton = styled.button`
  background-color: ${props => props.theme.buttonBackground};
  color: ${props => props.theme.buttonText};
  border: none;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
`;

function CodeInput({ onSubmit }) {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    onSubmit(code);
    setCode('');
  };

  return (
    <InputArea>
      <TextArea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code here"
      />
      <SendButton onClick={handleSubmit}>Send</SendButton>
    </InputArea>
  );
}

export default CodeInput;
