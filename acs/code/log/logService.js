var log4js = require('log4js');
log4js.configure({
	appenders: {
		fileLog: {
			type: "dateFile",
			filename: process.cwd()+'/acs/code/log/log.log',
			pattern: "_yyyy-MM-dd",
			alwaysIncludePattern: false,
		},
		console: { type: 'console' }
	},
	categories: {
		dateFile: { appenders: ['fileLog'], level: 'info' },
		console: { appenders: ['console'], level: 'trace' },
		default: { appenders: ['console', 'fileLog'], level: 'trace' }
	},
	replaceConsole: true
});
var dateFileLog = log4js.getLogger('fileLog');
exports.logger = dateFileLog;

exports.use = function (app) {
	//app.use(log4js.connectLogger(dateFileLog, {level:'INFO', format:':method :url'}));
	app.use(log4js.connectLogger(dateFileLog, { level: 'auto', format: ':method :url' }));
}

