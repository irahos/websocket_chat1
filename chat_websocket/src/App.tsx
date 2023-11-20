import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import './App.css';

interface Message {
 type: string;
 content: string;
}

const socket = new WebSocket('wss://chat-backend-s0kz.onrender.com/');

function App() {
 const [messages, setMessages] = useState<Message[]>([]);
 const [message, setMessage] = useState('');

 const getPosition = (index: number) => {
    if (index % 2 === 0) {
      return 'left';
    }

    return 'right';
 }

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMessage: Message = { type: 'message', content: message };
    if (message.trim()) {
      socket.send(JSON.stringify(newMessage));
      setMessage('');
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
 };

 useEffect(() => {
    socket.addEventListener('message', (event) => {
      const receivedMessage: Message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
 }, []);

 return (
    <div className='chat'>
      <form onSubmit={handleSubmit} className='form'>
        <input
          className='input'
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className='button'>send</button>
      </form>
      <div className="messages">
        {messages.map((messageToDisplay, index) => {
          return (
            <div key={index} className={classNames('message', {
                'message-left': getPosition(index) === 'left',
                'message-right': getPosition(index) === 'right',
            })}>
                {messageToDisplay.content}
            </div>
          );
        })}
      </div>
    </div>
 );
}

export default App;