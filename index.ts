import express from 'express';
import cors from 'cors';
import stateCodeMap from './stateCodeMap.json';
import { JSDOM } from 'jsdom';
import refreshData from './utils/refreshData';

const app = express();
app.use(cors());
// setInterval(async () => {
// 	console.log('Refreshing');
// 	await refreshData();
// }, 1000);

refreshData();
app.get('/', async (req, res) => {
	res.send('Hello World!');
});

// Port to listen on
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
