import express from 'express';
import cors from 'cors';
import moment from 'moment';
import { isDate } from './utils/Validation';
import refreshData from './utils/refreshData';
import mysql from 'mysql2';
import * as dotenv from 'dotenv';
import NodeCache from 'node-cache';
import StateCodeMap from './stateCodeMap';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './swagger.json';
import { Request, Response } from 'express-serve-static-core';
import QueryString from 'qs';
dotenv.config({ path: './.env' });

const app = express();
app.use('/assets', express.static(__dirname + '/assets'));
const swaggerDocument = {
	info: {
		title: 'COVID-19 API',
		version: '1.0.0',
		description: 'Public API for COVID-19 Data of India',
		contact: {
			name: 'Heet Vakharia',
			email: 'heetkv@gmail.com',
		},

		servers: ['https://covidindiapublicapi.herokuapp.com/'],
	},
	basePath: '/',
	host: 'https://covidindiapublicapi.herokuapp.com/',
	swagger: '2.0',
};
app.use(cors());
app.use(
	'/docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerDefinition, {
		swaggerOptions: swaggerDocument,
		customSiteTitle: 'Covid India',
		customCss: '.swagger-ui .topbar { display: none }',
		customfavIcon: './assets/favicon.ico',
	}),
);
const pool = mysql.createPool({
	host: process.env.MYSQL_ADDON_HOST,
	database: process.env.MYSQL_ADDON_DB,
	user: process.env.MYSQL_ADDON_USER,
	password: process.env.MYSQL_ADDON_PASSWORD,
	port: Number(process.env.MYSQL_ADDON_PORT),
	uri: process.env.MYSQL_ADDON_URI,
});
const db = pool.promise();
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });
(async () => {
	console.log('Adding Data');
	await refreshData(db, cache);
})();
const day = 1000 * 60 * 60 * 24;
setInterval(async () => {
	console.log('Refreshing');
	await refreshData(db, cache);
}, day);
app.get('/', (req: Request, res: Response) => {
	res.redirect('/docs');
});
// All States
app.get(
	'/states',
	async (
		req: Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>, number>,
	) => {
		let { min_date: minDate, max_date: maxDate } = req.query;
		if (!minDate) {
			minDate = moment().subtract(1, 'days').format('YYYY-MM-DD') as string;
		}
		if (!maxDate) {
			maxDate = moment().format('YYYY-MM-DD') as string;
		}
		if (!(isDate(minDate as string) && isDate(maxDate as string))) {
			return res.status(400).json({ error: 'Invalid Date' });
		}
		if (cache.has(`states-${minDate}-${maxDate}`)) {
			return res.status(200).send(cache.get('states'));
		}
		const data = await db.query(
			`SELECT * FROM state_cases WHERE date BETWEEN '${minDate}' AND '${maxDate}'`,
		);
		cache.set(`states-${minDate}-${maxDate}`, data[0], day);
		res.status(200).send(data[0] as any);
	},
);

// Get Data for a specific state by state code
app.get(
	'/states/code/:state_code',
	async (
		req: Request<
			{
				state_code: string;
			},
			any,
			any,
			QueryString.ParsedQs,
			Record<string, any>
		>,
		res: Response<any, Record<string, any>, number>,
	) => {
		let { min_date: minDate, max_date: maxDate } = req.query;
		const stateCode = Number(req.params.state_code);

		if (!minDate) {
			minDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
		}
		if (!maxDate) {
			maxDate = moment().format('YYYY-MM-DD');
		}
		if (!(isDate(minDate as string) && isDate(maxDate as string))) {
			return res.json({ error: 'Invalid Date' });
		}
		if (stateCode === NaN || stateCode < 1 || stateCode > 36) {
			return res
				.status(400)
				.json({ error: 'Invalid State Code', state_code: stateCode });
		}
		const stateAbbrCheck = Object.values(StateCodeMap).find(
			(v: [string | string[], number]) => v[1] === stateCode,
		) as any;
		if (!stateAbbrCheck) {
			return res.status(400).json({ error: 'Invalid State Code' });
		}
		const stateAbbr = stateAbbrCheck[0] as string;
		if (cache.has(`state_${stateAbbr}-${minDate}-${maxDate}`)) {
			return res.status(200).send(cache.get(`state_${stateAbbr}`));
		}
		try {
			const [data] = await db.query(
				`SELECT * FROM state_cases WHERE state_code=${stateCode} AND (date BETWEEN '${minDate}' AND '${maxDate}')`,
			);
			console.log(minDate, maxDate);
			cache.set(`state_${stateAbbr}-${minDate}-${maxDate}`, data, day);
			return res.status(200).send(data);
		} catch (err) {
			return res.status(400).send({ error: 'Invalid State Code' });
		}
	},
);

// Get Data for a specific state by state abbr
app.get(
	'/states/abbr/:state_abbr',
	async (
		req: Request<
			{
				state_abbr: string;
			},
			any,
			any,
			QueryString.ParsedQs,
			Record<string, any>
		>,
		res: Response<any, Record<string, any>, number>,
	) => {
		let { min_date: minDate, max_date: maxDate } = req.query;
		const stateAbbr: string = req.params.state_abbr;
		if (!stateAbbr) {
			res.status(400).json({ error: 'State Abbr Undefined' });
		}
		if (!minDate) {
			minDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
		}
		if (!maxDate) {
			maxDate = moment().format('YYYY-MM-DD');
		}
		if (cache.has(`state_${stateAbbr}`)) {
			console.log('Cache Hit');
			return res.status(200).send(cache.get(`state_${stateAbbr}`));
		}
		if (!(isDate(minDate as string) && isDate(maxDate as string))) {
			return res.json({ error: 'Invalid Date' });
		}
		const [data] = await db.query(
			`SELECT * FROM state_cases WHERE state_abbr LIKE '%${stateAbbr}%' AND (date BETWEEN '${minDate}' AND '${maxDate}')`,
		);
		cache.set(`state_${stateAbbr}`, data, day);
		res.status(200).send(data);
	},
);

// Get Data for whole country
app.get(
	'/country',
	async (
		req: Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>, number>,
	) => {
		let { min_date: minDate, max_date: maxDate } = req.query;

		if (!minDate) {
			minDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
		}
		if (!maxDate) {
			maxDate = moment().format('YYYY-MM-DD');
		}
		if (cache.has(`country-${minDate}-${maxDate}`)) {
			return res.status(200).send(cache.get('country'));
		}
		if (!(isDate(minDate as string) && isDate(maxDate as string))) {
			return res.json({ error: 'Invalid Date' });
		}
		const [data] = await db.query(
			`SELECT * FROM country_cases WHERE date BETWEEN '${minDate}' AND '${maxDate}'`,
		);
		cache.set(`country-${minDate}-${maxDate}`, data, day);
		res.status(200).send(data);
	},
);

// Port to listen on
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
