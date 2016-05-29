var request = require('request');
var cheerio = require('cheerio');

const XBL_STATUS_URL = 'http://support.xbox.com/en-US/xbox-live-status';
const SERVICES = ['XboxLiveCoreServices', 'PurchaseandContentUsage',
									'Website', 'TVMusicandVideo', 'SocialandGaming'];

// Statuses: 'Normal', 'Limited', 'Unavailable', 'Unknown'

function getXblServicesHtml() {
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

function main() {
	getXblServicesHtml().then(function(html) {
		console.log(getServiceStatuses(html));
	}).catch(function(error) {
		console.log(error);
	});
}

main();