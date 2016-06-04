var request = require('request');
var cheerio = require('cheerio');
var chalk = require('chalk');

const XBL_STATUS_URL = 'http://support.xbox.com/en-US/xbox-live-status';
const SERVICES = ['XboxLiveCoreServices', 'PurchaseandContentUsage',
									'Website', 'TVMusicandVideo', 'SocialandGaming'];


function getXboxLiveServicesHtml() {
	return new Promise((resolve, reject) => {
		request(XBL_STATUS_URL, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				resolve(body);
			} else {
				reject(error);
			}
		});
	});
}

function getServiceStatuses(page) {
	var $ = cheerio.load(page);
	var output = {};

	SERVICES.map((serviceName) => {
		output[serviceName] = $('#' + serviceName + ' .statusheading span').html()
	});
	return output;
}

function printPrettyServiceStatuses(serviceStatusMap) {
	var colorStatus = (status) => {
		var output = status;
		switch(status) {
			case 'Normal':
				output = chalk.green(status);
				break;
			case 'Limited':
				output = chalk.yellow(status);
				break;
			case 'Unavailable':
				output = chalk.red(status);
				break;
			default:
				output = chalk.gray('Unknown');
				break;
		}
		return output;
	};

	Object.keys(serviceStatusMap).forEach((service) => {
		console.log(chalk.bold(service) + ': ' + colorStatus(serviceStatusMap[service]));
	});
}

function main() {
	getXboxLiveServicesHtml().then(function(html) {
		var services = getServiceStatuses(html);
		printPrettyServiceStatuses(services);
	}).catch(function(error) {
		console.log(error);
	});
}

main();
