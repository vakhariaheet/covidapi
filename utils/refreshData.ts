import { JSDOM } from 'jsdom';
import { Pool } from 'mysql2/promise';
import NodeCache from 'node-cache';

import indiaData from './indiaData';
import stateCases from './stateCases';
export default async (db: Pool, cache: NodeCache) => {
	const url = 'https://www.mohfw.gov.in/';
	const { window } = await JSDOM.fromURL(url);
	const { document } = window;
	const indiaReport = await indiaData(document, db, cache);
	const stateReport = await stateCases(db, cache);
	return {
		indiaReport,
		stateReport,
	};
};
