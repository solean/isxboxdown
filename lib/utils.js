const chalk = require('chalk');

const MAX_SERVICE_NAME_LENGTH = 26;


function colorStatus(status) {
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
}

function printPrettyServiceStatuses(serviceStatusMap) {
  var getNumSpaces = len => {
    var output = '';
    var n = MAX_SERVICE_NAME_LENGTH - len + 2;
    for (var i = 0; i < n; i++) {
      output += ' ';
    }
    return output;
  };

  var output = '\n| Service Name                | Status |\n'
    + '|-----------------------------|--------|\n';

  Object.keys(serviceStatusMap).forEach(service => {
    var boldService = chalk.bold(service);
    var spaces = getNumSpaces(service.length);
    var status = colorStatus(serviceStatusMap[service]);
    output += `| ${boldService}${spaces}| ${status} |\n`;
  });

  console.log(output);
}

module.exports.printPrettyServiceStatuses = printPrettyServiceStatuses;
