import express from 'express';
import cors from 'cors';
import { generateAddress, getTaxFreeStates } from './addressGenerator.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/address/:country', (req, res) => {
    try {
        const address = generateAddress(req.params.country.toUpperCase());
        res.json(address);
    } catch (error) {
        res.status(400).json({ error: 'Invalid country code' });
    }
});

app.get('/api/tax-free-states', (req, res) => {
    res.json(getTaxFreeStates());
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
