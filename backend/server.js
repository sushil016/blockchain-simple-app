const express = require('express');
const Web3 = require('web3').Web3;
const cors = require('cors');
const contractABI = require('./EnhancedMessageABI.json');

const app = express();
app.use(cors());
app.use(express.json());

const web3 = new Web3('http://172.27.192.1:7545'); // Connect to your local blockchain
const contractAddress = '0xa49C287578c1a59D1020b1c16752b8f18091B6Ac'; // Replace with your deployed contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

app.post('/api/messages', async (req, res) => {
    try {
        const { content, from } = req.body;
        const gasEstimate = await contract.methods.addMessage(content).estimateGas({ from });
        const result = await contract.methods.addMessage(content).send({ from, gas: gasEstimate });
        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/messages', async (req, res) => {
    try {
        const messages = await contract.methods.getAllMessages().call();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/tokens/:address', async (req, res) => {
    try {
        const balance = await contract.methods.getTokenBalance(req.params.address).call();
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));