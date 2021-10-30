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

export default async (document: Document) => {
	const deaths = covidData('.bg-red .mob-hide', document);
	const active = covidData('.bg-blue .mob-hide', document);
	const recovered = covidData('.bg-green .mob-hide', document);
	const vaccinated = covidData('.fullbol span', document);

	return {
		[deaths[0]]: {
			total: deaths[1],
			today: deaths[2],
		},
		[active[0]]: {
			total: active[1],
			today: active[2],
		},
		[recovered[0]]: {
			total: recovered[1],
			today: recovered[2],
		},
		[vaccinated[0]]: {
			total: vaccinated[1],
			today: vaccinated[2],
		},
	};
};
