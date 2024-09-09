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
   
    <div className='bg-zinc-950 w-full min-h-screen text-neutral-300'>
    <Navbar/>
     <div className='flex justify-center items-center flex-col gap-3'>
     <h1 className='text-3xl mt-32'>Enhanced Message DAppoo</h1>
      <p className='hover:text-neutral-400 hover:underline'>Connected Account: {account}</p>
      <p className=''>Token Balance: {tokenBalance}</p>
      <input 
      className='p-3 rounded-full border m-4 bg-zinc-600 px-5 pr-32'
        type="text" 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
        placeholder="Enter new message"
      />
      <button className=' border-white border-b-2 px-4text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' onClick={sendMessage}>Send Message</button>
      <h2>Messages:</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.content} - From: {msg.sender} at {new Date(msg.timestamp * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
     </div>
    </div>
    </>
  );
}

export default App;