import { Pool } from 'mysql2/promise';
import moment from 'moment';
const covidData = (className: string, document: Document): any => {
	let eles = Array(...(document.querySelectorAll(`${className}`) as any))
		.map((ele) => {
			const eleText = ele.textContent?.split(/\s/);
			return eleText;
		})
		.flat() as string[];
	if (className === '.fullbol span') {
		eles.shift();
	}

	const newData = eles
		.map((e, i) => {
			if (i === 0) {
				return e;
			} else {
				const num = e.replace(/[\(\),]/g, '').trim();
				return isNaN(Number(num)) ? undefined : Number(num);
			}
		})
		.filter((e) => e);
	return newData;
};

export default async (document: Document, db: Pool) => {
	// Check if the data is already updated today
	const date = moment().format('YYYY-MM-DD');
	const [rows] = await db.execute(
		`SELECT * FROM country_cases WHERE date = ?`,
		[date],
	);
	if ((rows as Array<object>).length) {
		console.log('Country Data already updated today');
		return;
	}

	const deaths = covidData('.bg-red .mob-hide', document);
	const active = covidData('.bg-blue .mob-hide', document);
	const recovered = covidData('.bg-green .mob-hide', document);
	const vaccinated = covidData('.fullbol span', document);
	console.log('DATA Scarped From Ministry of Health,GOI');
	const indiaCases = {
		death: deaths[2],
		death_today: deaths[1],
		active: active[2],
		recovered: recovered[2],
		recovered_today: recovered[1],
		vaccinated: vaccinated[1],
		vaccinated_today: vaccinated[2],
		active_today: active[1],
		date: moment().format('YYYY-MM-DD'),
	};
	// Insert data into database
	await db.query(`INSERT INTO country_cases SET ?`, [indiaCases]);
	console.log('Country Data updated');
};
