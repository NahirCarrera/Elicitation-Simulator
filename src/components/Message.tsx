import React from 'react';

interface MessageProps {
  text: string;
  sender: 'client' | 'elicitor';
}

const Message: React.FC<MessageProps> = ({ text, sender }) => {
  const isClient = sender === 'elicitor';
  const messageStyle = {
    alignSelf: isClient ? 'flex-end' : 'flex-start',
    backgroundColor: isClient ? '#dcf8c6' : '#ffffff',
    borderRadius: '20px',
    padding: '10px',
    margin: '5px',
    maxWidth: '60%',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: isClient ? 'flex-start' : 'flex-end',
  
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isClient ? 'flex-end' : 'flex-start' }}>
      <div style={messageStyle}>
        {text}
      </div>
    </div>
  );
};

export default Message;
