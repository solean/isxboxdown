#!/usr/bin/env node

const request = require('request');
const cheerio = require('cheerio');
const printUtils = require('./utils');

const XBL_STATUS_URL = 'http://support.xbox.com/en-US/xbox-live-status';
const SERVICE_NAMES = ['Xbox Live Core Services',
											 'Purchase and Content Usage',
											 'Website',
											 'TV Music and Video',
											 'Social and Gaming'
											];


function getHTML(url) {
	return new Promise((resolve, reject) => {
		request(url, (error, response, body) => {
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

	SERVICE_NAMES.map(serviceName => {
		var className = serviceName.split(' ').join('');
		output[serviceName] = $('#' + className + ' .statusheading span').html()
	});
	return output;
}

function getServiceStatuses() {
	return new Promise((resolve, reject) => {
		getHTML(XBL_STATUS_URL).then(html => {
			resolve(getServiceStatusesFromHtml(html));
		}).catch(error => {
			reject('Sorry, an error occurred:\n' + '"' + error + '"');
		})
	});
}


function main() {
	getServiceStatuses().then(services => {
		printUtils.printPrettyServiceStatuses(services);
	}).catch(error => {
		console.log(error);
	})
}

module.exports.getServiceStatuses = getServiceStatuses;

main();

