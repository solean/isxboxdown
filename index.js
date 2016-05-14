var request = require('request');
var cheerio = require('cheerio');

const XBL_STATUS_URL = 'http://support.xbox.com/en-US/xbox-live-status';

function getHtml() {
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

getHtml().then(function(html) {
	var $ = cheerio.load(html);
}).catch(function(error) {
	console.log(error);
});