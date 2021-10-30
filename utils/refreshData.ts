import { JSDOM } from 'jsdom';
import indiaData from './indiaData';
export default async () => {
	const url = 'https://www.mohfw.gov.in/';
	const { window } = await JSDOM.fromURL(url);
	const { document } = window;
	const indiaReport = indiaData(document);
	return indiaReport;
};
