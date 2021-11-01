import axios from 'axios';
import { Pool } from 'mysql2/promise';
import StateCodeMap from '../stateCodeMap.json';
import moment from 'moment';
interface IState {
	sno: string;
	state_name: string;
	active: string;
	positive: string;
	cured: string;
	death: string;
	new_active: string;
	new_positive: string;
	new_cured: string;
	new_death: string;
	state_code: string;
}

export default async (db: Pool) => {
	// Checking if data is already updated today
	const [data] = await db.query(
		`SELECT * FROM state_cases WHERE date="${moment().format('YYYY-MM-DD')}"`,
	);
	if ((data as Array<object>).length) {
		console.log('State Data already updated today');
		return;
	}
	// Fetching Data from GOVERNMENT API
	let { data: stateData } = await axios(
		'https://www.mohfw.gov.in/data/datanew.json',
	);
	console.log('Data Fetched From GOI API');

	// Connecting State Abbreviation to State Name
	stateData = stateData.map((stateInfo: IState) => {
		stateInfo = {
			...stateInfo,
			state_name: stateInfo.state_name.replace(/[*,/(/)]/g, ''),
		};
		let stateAbbr: string | string[] | undefined = (
			StateCodeMap as {
				[key: string]: string | string[];
			}
		)[stateInfo.state_name];
		if (typeof stateAbbr === 'undefined') {
			stateAbbr = 'NA';
		} else {
			stateAbbr =
				typeof stateAbbr === 'string'
					? stateAbbr
					: (stateAbbr as string[]).join(',');
		}

		let stateDetails = {
			state_name: stateInfo.state_name,
			active_today: Number(stateInfo.new_active) - Number(stateInfo.active),
			positive_today:
				Number(stateInfo.new_positive) - Number(stateInfo.positive),
			recovered_today: Number(stateInfo.new_cured) - Number(stateInfo.cured),
			death_today: Number(stateInfo.new_death) - Number(stateInfo.death),
			active: Number(stateInfo.new_active),
			positive: Number(stateInfo.new_positive),
			recovered: Number(stateInfo.new_cured),
			death: Number(stateInfo.new_death),
			state_code: Number(stateInfo.state_code),
			state_abbr: stateAbbr,

			date: moment().format('YYYY-MM-DD'),
		};
		return stateDetails;
	});
	stateData.pop();
	// Converting State Cases Object to Array
	const stateCases = stateData.map((stateCases: any) => {
		stateCases = {
			...stateCases,
			state_name: `'${stateCases.state_name}'`,
			state_abbr: `'${stateCases.state_abbr}'`,
			date: `'${stateCases.date}'`,
		};
		return Object.values(stateCases);
	});
	// Inserting Data into Database
	await db.query(
		`INSERT INTO state_cases (state_name, active_today, positive_today, recovered_today, death_today, active, positive, recovered, death, state_code,state_abbr,date) VALUES (${stateCases.join(
			'),(',
		)})`,
	);
	console.log('State Data Updated');
	return stateData;
};
