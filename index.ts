import express from 'express';
import cors from 'cors';
import stateCodeMap from './stateCodeMap.json';
import moment, { isDate } from 'moment';
import refreshData from './utils/refreshData';
import mysql from 'mysql2';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT),
});
const db = pool.promise();
(async () => {
	console.log('Adding Data');
	await refreshData(db);
})();
const day = 1000 * 60 * 60 * 24;
setInterval(async () => {
	console.log('Refreshing');
	await refreshData(db);
}, day);
app.get('/', async (req, res) => {
	res.send('Hello World!');
});
// Get all states data
app.get('/states', async (req, res) => {
	let { minDate, maxDate } = req.query;
	if (!minDate) {
		minDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
	}
	if (!maxDate) {
		maxDate = moment().format('YYYY-MM-DD');
	}

	const data = await db.query(
		`SELECT * FROM state_cases WHERE date BETWEEN '${minDate}' AND '${maxDate}'`,
	);
	res.send(data[0]);
});
// Get Data for a specific state by state code
app.get('/states/code/:state_code', async (req, res) => {
	let { minDate, maxDate } = req.query;
	if (!minDate) {
		minDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
	}
	if (!maxDate) {
		maxDate = moment().format('YYYY-MM-DD');
	}
	const stateCode = Number(req.params.state_code);
	if (stateCode === NaN || stateCode < 1 || stateCode > 36) {
		return res
			.status(400)
			.json({ error: 'Invalid State Code', state_code: stateCode });
	}
	try {
		const data = await db.query(
			`SELECT * FROM state_cases WHERE state_code=${stateCode} AND (date BETWEEN '${minDate}' AND '${maxDate}')`,
		);
		res.send(data[0]);
	} catch (err) {
		res.status(500).send(err);
	}
});
// Get Data for a specific state by state abbr
app.get('/states/abbr/:state_abbr', async (req, res) => {
	let { minDate, maxDate } = req.query;
	const stateAbbr: string = req.params.state_abbr;
	if (!(isDate(minDate) && isDate(maxDate))) {
		res.json({ error: 'Invalid Date' });
	}
	if (!stateAbbr) {
		res.json({ error: 'State Abbr Undefined' });
	}
	if (!minDate) {
		minDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
	}
	if (!maxDate) {
		maxDate = moment().format('YYYY-MM-DD');
	}

	const data = await db.query(
		`SELECT * FROM state_cases WHERE state_abbr LIKE '%${stateAbbr}%' AND (date BETWEEN '${minDate}' AND '${maxDate}')`,
	);
	res.send(data[0]);
});
// Get Data for whole country
app.get('/country', async (req, res) => {
	let { minDate, maxDate } = req.query;
	if (!(isDate(minDate) && isDate(maxDate))) {
		res.json({ error: 'Invalid Date' });
	}
	if (!minDate) {
		minDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
	}
	if (!maxDate) {
		maxDate = moment().format('YYYY-MM-DD');
	}

	const data = await db.query(
		`SELECT * FROM country_cases AND (date BETWEEN '${minDate}' AND '${maxDate}')`,
	);
	res.send(data[0]);
});

// Port to listen on
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
