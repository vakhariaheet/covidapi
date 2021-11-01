import { JSDOM } from 'jsdom';
import { Pool } from 'mysql2/promise';

import indiaData from './indiaData';
import stateCases from './stateCases';
export default async (db: Pool) => {
	const url = 'https://www.mohfw.gov.in/';
	const { window } = await JSDOM.fromURL(url);
	const { document } = window;
	const indiaReport = await indiaData(document, db);
	const stateReport = await stateCases(db);
	return {
		indiaReport,
		stateReport,
	};
};
