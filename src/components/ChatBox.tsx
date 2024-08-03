import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import QuestionBox from './QuestionBox';

interface Option {
  text: string;
  response: string;
  isCorrect: boolean;
}

interface Section {
  options: Option[];
}

interface Message {
  text: string;
  sender: 'client' | 'elicitor';
}

const questionsAndAnswers: Record<string, Section> = {
  section1: {
    options: [
      { text: "¿Cómo llevan actualmente las reservas y qué problemas específicos enfrentan con este proceso?", response: "Bueno, llevamos las reservas en una libreta y una hoja de cálculo. El problema es que a veces no encontramos una reserva específica, cometemos errores al ingresar los datos y nos toma mucho tiempo revisar todo. Es un poco frustrante.", isCorrect: true },
      { text: "¿Cómo manejan las reservas en su sistema actual?", response: "Hmm, no estoy seguro de a qué te refieres con 'sistema actual'. Solo usamos una libreta y una hoja de cálculo, y a veces es complicado.", isCorrect: false },
      { text: "¿Qué tipo de problemas enfrentan con las reservas?", response: "Usamos una libreta y una hoja de cálculo, pero no estoy seguro de a qué problemas te refieres exactamente.", isCorrect: false },
      { text: "Me gustaría saber cómo manejan las reservas día a día y qué problemas tienen.", response: "Bueno, reviso correos, miro la libreta y la hoja de cálculo para ver las reservas del día, hago llamadas para confirmar... A veces es un poco caótico.", isCorrect: false }
    ]
  },
  section2: {
    options: [
      { text: "¿Cómo le gustaría visualizar la lista de reservas para que sea fácil de usar y entender?", response: "Me gustaría tener una lista clara donde pueda buscar reservas por nombre o fecha, y ver todos los detalles importantes de cada reserva fácilmente. Algo intuitivo.", isCorrect: true },
      { text: "¿Qué tipo de interfaz prefieren para la lista de reservas?", response: "Hmm, no estoy seguro de qué es una 'interfaz'. Solo quiero una lista donde pueda buscar por nombre y fecha.", isCorrect: false },
      { text: "¿Qué vista de lista de reservas prefieren?", response: "No estoy seguro de a qué tipo de vista te refieres. Tal vez una lista donde pueda buscar por nombre y fecha.", isCorrect: false },
      { text: "¿Cómo se frustran al buscar una reserva?", response: "Me frustro un poco si no puedo encontrarla rápidamente. A veces me toma bastante tiempo revisar todo.", isCorrect: false }
    ]
  },
  section3: {
    options: [
      { text: "¿Cómo debería ser el proceso para cambiar una reserva de manera fácil y rápida?", response: "Debería ser sencillo. Algo como seleccionar la reserva que quiero cambiar, hacer los ajustes necesarios y luego confirmar los cambios. Un mensaje de confirmación antes de guardar sería útil.", isCorrect: true },
      { text: "¿Cómo deberían editar las reservas?", response: "No sé qué significa ‘editar’. Solo quiero que sea fácil cambiar una reserva y recibir una confirmación antes de guardar.", isCorrect: false },
      { text: "¿Cuál sería el método efectivo para modificar reservas?", response: "No estoy seguro de lo que ‘efectivo’ significa aquí. Tal vez algo sencillo con una confirmación.", isCorrect: false },
      { text: "¿Cómo hacen los cambios en las reservas?", response: "Reviso la libreta, luego veo la hoja de cálculo y hago el cambio. A veces llamo para confirmar con el cliente.", isCorrect: false }
    ]
  },
  section4: {
    options: [
      { text: "¿Cómo le gustaría que se le informe cuando una reserva se ha cancelado?", response: "Me gustaría recibir un mensaje claro que confirme la cancelación, con todos los detalles de la reserva cancelada para poder actualizar mis registros. Algo que no deje lugar a dudas.", isCorrect: true },
      { text: "¿Cómo quiere que el sistema le informe sobre cancelaciones?", response: "No sé qué es un ‘sistema’. Solo necesito un mensaje claro que confirme la cancelación.", isCorrect: false },
      { text: "¿Cuál sería el método adecuado para informarle sobre cancelaciones?", response: "No estoy seguro de lo que ‘adecuado’ implica. Un mensaje claro sobre la cancelación y su solución sería suficiente.", isCorrect: false },
      { text: "¿Cómo registra las cancelaciones?", response: "Usualmente tengo que llamar al cliente y avisarle, luego marco la cancelación en la libreta y la hoja de cálculo.", isCorrect: false }
    ]
  },
  section5: {
    options: [
      { text: "¿Cómo debería ser informado cuando ocurre un error para que pueda entender y solucionar el problema?", response: "Debería recibir un mensaje claro que explique el error y cómo solucionarlo, así sabré exactamente qué hacer para arreglarlo. No quiero tener que adivinar.", isCorrect: true },
      { text: "¿Qué mecanismo debería usarse para informarle sobre errores?", response: "No sé qué es un ‘mecanismo’. Solo quiero una notificación inmediata cuando ocurra un error para que pueda actuar rápidamente.", isCorrect: false },
      { text: "¿Cuál sería la forma adecuada de informarle sobre errores?", response: "No estoy seguro de lo que ‘adecuada’ implica. Quiero que el sistema me avise cuando haya un problema, para que pueda investigar lo que salió mal.", isCorrect: false },
      { text: "¿Cómo maneja los errores actualmente?", response: "Trato de solucionarlo revisando la libreta y la hoja de cálculo, y si no puedo, llamo a mi colega para pedir ayuda.", isCorrect: false }
    ]
  }
};

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('section1');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isQuestionEnabled, setIsQuestionEnabled] = useState<boolean>(true);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSelectOption = (option: Option) => {
    // Add the elicitor's message to the chat
    const elicitorMessage: Message = {
      text: option.text,
      sender: 'elicitor'
    };
    setMessages([...messages, elicitorMessage]);
    setSelectedOption(option.text);  // Mark the selected option

    // Show "Typing..." message
    setIsTyping(true);
    setIsQuestionEnabled(false);

    // Delay before showing the response
    setTimeout(() => {
      const clientMessage: Message = {
        text: option.response,
        sender: 'client'
      };

      setMessages(messages => [...messages, clientMessage]);
      setIsTyping(false);
      setSelectedOption(null);  // Reset selected option for new questions

      const nextSection = getNextSection(currentSection);
      if (nextSection) {
        setCurrentSection(nextSection);
      } else {
        setCurrentSection('');
      }
      setIsQuestionEnabled(true);
    }, 2000); // Simulate typing delay
  };

  const getNextSection = (currentSection: string): string | null => {
    const sections = Object.keys(questionsAndAnswers);
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex === -1 || currentIndex === sections.length - 1) {
      return null;
    }
    return sections[currentIndex + 1];
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', height: '50vh', width: '200%', margin: '0 auto', border: '1px solid #ccc', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: '#f1f1f1', overflowY: 'auto', height: '100%' }}>
        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          {messages.map((message, index) => (
            <Message key={index} text={message.text} sender={message.sender} />
          ))}
          {isTyping && <Message text="Escribiendo..." sender="client" />}
          <div ref={chatEndRef} /> {/* Ref to handle auto-scroll */}
        </div>
      </div>
      <div style={{ padding: '20px', backgroundColor: '#fff', overflowY: 'auto', height: '100%' }}>
        {Object.keys(questionsAndAnswers).map((sectionKey, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            {sectionKey === currentSection && (
              <QuestionBox 
                options={questionsAndAnswers[sectionKey].options} 
                onSelect={handleSelectOption} 
                selectedOption={selectedOption} 
                isQuestionEnabled={isQuestionEnabled} // Pass isQuestionEnabled to QuestionBox
              />
            )}
          </div>
        ))}
        {currentSection === '' && (
          <div style={{ textAlign: 'center' }}>
            <a href="https://forms.gle/1VirkEGuF959XP6g6" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff' }}>
              <button style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Iniciar la Evaluación
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
