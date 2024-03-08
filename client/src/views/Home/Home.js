import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './Home.css';

const socket = io('http://localhost:5002');

function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userStatus, setUserStatus] = useState({});

  const chatContainerRef = useRef(null);

  const loadUsers = async () => {
    try {
      const { data } = await axios.get('/api/users');
      setUsers(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCurrentUser = () => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    if (userFromLocalStorage) {
      setCurrentUser(userFromLocalStorage);
    } else {
      window.location.href = '/login';
    }
  };

  const findFullName = (id) => {
    return users.find((user) => user._id === id)?.fullName;
  };

  const getUserStatus = (userId) => {
    return userStatus[userId] || 'offline';
  };

  useEffect(() => {
    loadUsers();
    loadCurrentUser();

    socket.on('userStatus', (data) => {
      setUserStatus((prevUserStatus) => ({
        ...prevUserStatus,
        [data.userId]: data.status,
      }));
    });
  }, []);

  useEffect(() => {
    socket.emit('userConnected', currentUser?._id);

    return () => {
      socket.emit('userDisconnected', currentUser?._id);
    };
  }, [currentUser]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  socket.on('message', (data) => {
    if (data?.receiver === currentUser?._id || data?.sender === currentUser?._id) {
      setMessages([...messages, data]);
    }
  });

  const readableTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div>
      <h1 className='text-center mb-5'>Chat App (User-{currentUser?.fullName})</h1>
      <p className='text-center'>Select message receiver 👇</p>
      <select
        className='input-select'
        onChange={(e) => {
          const selectedUser = users.find((user) => user._id === e.target.value);
          setSelectedUser(selectedUser);
        }}
      >
        <option value=''>Select receiver</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.fullName}
          </option>
        ))}
      </select>

      {!selectedUser && <div className='alert alert-warning'>Please select a user.</div>}

      <div className='div'>
        <p className='text-center'>
          Chat With <span className='text-danger'>{selectedUser ? selectedUser.fullName : ''}</span>
          {getUserStatus(selectedUser?._id) === 'online' ? ' (Online)' : ' (Offline)'}
        </p>
        <hr />

        <div className='chat-container' ref={chatContainerRef}>
          {messages
            .filter(
              (message) =>
                message.sender === selectedUser?._id ||
                message.receiver === selectedUser?._id ||
                !selectedUser?._id
            )
            .map((message) => (
              <div
                key={message.timestamp}
                className={`chatbox ${
                  currentUser?._id === message?.sender ? 'chatbox-sent' : 'chatbox-received'
                }`}
              >
                <p className='user-name'>
                  {message.sender === currentUser?._id ? 'You' : findFullName(message?.sender)}
                </p>
                <p className='message-text'>{message.message}</p>
                <p className='timestamp'>{readableTimestamp(message.timestamp)}</p>
              </div>
            ))}
        </div>

        <input
          className='input-msg'
          type='text'
          placeholder='Enter message'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />

        <button
          className='btn-send'
          onClick={() => {
            if (!selectedUser) {
              alert('Please select a user before sending a message.');
              return;
            }

            socket.emit('message', {
              sender: currentUser?._id,
              receiver: selectedUser._id,
              message,
              timestamp: new Date().toISOString(),
            });
            setMessage('');
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default Home;
