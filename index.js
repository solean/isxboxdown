#!/usr/bin/env node

const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');

const XBL_STATUS_URL = 'http://support.xbox.com/en-US/xbox-live-status';
const SERVICES = ['XboxLiveCoreServices', 'PurchaseandContentUsage',
									'Website', 'TVMusicandVideo', 'SocialandGaming'];


function getXboxLiveServicesHtml() {
	return new Promise((resolve, reject) => {
		request(XBL_STATUS_URL, (error, response, body) => {
			if (!error && response.statusCode == 200) {
				resolve(body);
			} else {
				reject(error);
			}
		});
	});
}

function getServiceStatusesFromHtml(page) {
	var $ = cheerio.load(page);
	var output = {};

	SERVICES.map(serviceName => {
		output[serviceName] = $('#' + serviceName + ' .statusheading span').html()
	});
	return output;
}

function printPrettyServiceStatuses(serviceStatusMap) {
	var colorStatus = status => {
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

	Object.keys(serviceStatusMap).forEach(service => {
		console.log(chalk.bold(service) + ': ' + colorStatus(serviceStatusMap[service]));
	});
}

function getServiceStatuses() {
	return new Promise((resolve, reject) => {
		getXboxLiveServicesHtml().then(html => {
			resolve(getServiceStatusesFromHtml(html));
		}).catch(error => {
			reject('Sorry, an error occurred:\n' + '"' + error + '"');
		})
	});
}


function main() {
	getServiceStatuses().then(services => {
		printPrettyServiceStatuses(services);
	}).catch(error => {
		console.log(error);
	})
}

module.exports.getServiceStatuses = getServiceStatuses;

main();

