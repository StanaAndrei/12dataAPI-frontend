import "https://cdn.jsdelivr.net/npm/chart.js@3.5.0/dist/chart.min.js";
import { symbols, months } from "./constants.js";
const select = document.querySelector('select');
const ctx = document.querySelector('#chart-canvas').getContext('2d');
let chart;
let needUpdate = false;

const getChart = values => {
	return new Chart(ctx, {
		type: 'line',
		data: {
			labels: months,
			datasets: [
				{
					label: 'low',
					data: values.map(val => val.low),
					borderColor: [
						'rgba(255, 99, 132, 1)',
					],
					borderWidth: 3
				},
				{
					label: 'high',
					data: values.map(val => val.high),
					borderColor: [
						'rgba(54, 162, 235, 1)',
					],
					borderWidth: 3
				},
			]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
	});
}

const removeData = chart => {
	chart.data.datasets.forEach((dataset) => {
		dataset.data = new Array(2).fill().map(() => []);
	});
	chart.update();
}

const addData = (chart, values) => {
	chart.data.datasets[0].data = values.map(val => val.low);
	chart.data.datasets[1].data = values.map(val => val.high);
	chart.update();
}


const drawChart = (values, needUpdate) => {
	if (!needUpdate) {
		chart = getChart(values);
	} else {
		removeData(chart);
		addData(chart, values);
	}
}

const handleSelectChange = async e => {
	e?.preventDefault();
	const { value: symbol } = select;
	const reqStr = `https://twelve-data1.p.rapidapi.com/time_series?symbol=${symbol}
																	&interval=1month
																	&outputsize=${months.length}
																	&format=json`;
	const res = await fetch(reqStr, {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "080be039edmsh2a8a95ce9e861fcp19fa06jsn929835407f6b",
			"x-rapidapi-host": "twelve-data1.p.rapidapi.com"
		}
	});
	if (res.status !== 200) {
		document.write('Smth went wrong on the server with the api, pls try again later!(not my fault)');
		return;
	}//*/
	const json = await res.json();
	if (!json) {
		alert('request failed');
		return;
	}
	drawChart(json.values, needUpdate);
	if (!needUpdate) {
		needUpdate = true;
	}
}

const initSelect = () => {
	for (let symbol of symbols) {
		let option = document.createElement('option');
		option.innerText = symbol;
		select.appendChild(option);
	}
}

//#region main
initSelect();
handleSelectChange();
select.addEventListener('change', handleSelectChange);
//#endregion handleSelectChange