// src/App.tsx
import React from 'react';
import ChatBox from './components/ChatBox';

const App: React.FC = () => {
  return (
    <div>
      <h1>Simulación de Chat de Elicitación</h1>
      <ChatBox />
    </div>
  );
};

export default App;
