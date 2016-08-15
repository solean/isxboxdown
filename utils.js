const chalk = require('chalk');

const MAX_SERVICE_NAME_LENGTH = 26;


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

  var getNumSpaces = len => {
    var output = '';
    var n = MAX_SERVICE_NAME_LENGTH - len + 2;
    for (var i = 0; i < n; i++) {
      output += ' ';
    }
    return output;
  };

  console.log('\n| Service Name                | Status |');
  console.log('|-----------------------------|--------|');
  Object.keys(serviceStatusMap).forEach(service => {
    var outputRow = '| ' + chalk.bold(service) + getNumSpaces(service.length) +
      '| ' + colorStatus(serviceStatusMap[service]) + ' |';
    console.log(outputRow);
  });
  console.log('\n');
}

module.exports.printPrettyServiceStatuses = printPrettyServiceStatuses;