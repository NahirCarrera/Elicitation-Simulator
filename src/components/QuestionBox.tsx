import React from 'react';

interface Option {
  text: string;
  response: string;
  isCorrect: boolean;
}

interface QuestionBoxProps {
  options: Option[];
  onSelect: (option: Option) => void;
  selectedOption: string | null; // Add selectedOption prop
  isQuestionEnabled: boolean; // Add isQuestionEnabled prop
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ options, onSelect, selectedOption, isQuestionEnabled }) => {
  return (
    <div>
      <h2>Selecciona una opcion</h2>
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => isQuestionEnabled && onSelect(option)} // Only trigger onSelect if isQuestionEnabled is true
          style={{
            padding: '10px',
            marginBottom: '10px',
            cursor: isQuestionEnabled ? 'pointer' : 'not-allowed', // Change cursor based on isQuestionEnabled
            backgroundColor: selectedOption === option.text ? '#e0f7fa' : '#ffffff',
            border: selectedOption === option.text ? '2px solid #00796b' : '1px solid #ccc',
            borderRadius: '5px',
            opacity: isQuestionEnabled ? 1 : 0.6 // Dim the options if they are disabled
          }}
        >
          {option.text}
        </div>
      ))}
    </div>
  );
};

export default QuestionBox;
