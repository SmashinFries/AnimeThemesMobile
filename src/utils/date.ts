export const getSeason = (next = false) => {
	const date = new Date();
	const SEASONS = {
		Winter: [1, 2, 3],
		Spring: [4, 5, 6],
		Summer: [7, 8, 9],
		Fall: [10, 11, 12],
	};
	const currMonth = date.getMonth() + 1;
	const month = next ? currMonth + 3 : currMonth;
	let year = date.getFullYear();
	let current_season = null;
	// let same_year;
	for (const season in SEASONS) {
		if (SEASONS[season as keyof typeof SEASONS].includes(month)) {
			current_season = season;
			// same_year = true;
			break;
		} else if (month > 12) {
			current_season = 'Winter';
			year += 1;
			// same_year = false;
			break;
		}
	}

	return { current_season, year };
};
