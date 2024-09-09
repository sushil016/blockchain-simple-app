import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import Navbar from './components/Navbar';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          fetchMessages();
          fetchTokenBalance(accounts[0]);
        } catch (error) {
          console.error("User denied account access");
        }
      }
    };
    initWeb3();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  const fetchTokenBalance = async (address) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/tokens/${address}`);
    setTokenBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post('http://localhost:3001/api/messages', { content: newMessage, from: account });
    setNewMessage('');
    fetchMessages();
    fetchTokenBalance(account);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  return (
    <>
    {/* <Navbar/> */}
    <div>
      <h1>Enhanced Message DAppoo</h1>
      <p>Connected Account: {account}</p>
      <p>Token Balance: {tokenBalance}</p>
      <input 
        type="text" 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
        placeholder="Enter new message"
      />
      <button onClick={sendMessage}>Send Message</button>
      <h2>Messages:</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.content} - From: {msg.sender} at {new Date(msg.timestamp * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default App;