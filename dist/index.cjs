const ILoveIMGApi = require('../src/ILoveIMGApi.js');
const Auth = require('../src/Auth.js');
const Task = require('../src/Task.js');
const { ILoveApiError, NetworkError } = require('../src/Error.js');

module.exports = {
	default: ILoveIMGApi,
	ILoveIMGApi,
	Auth,
	Task,
	ILoveApiError,
	NetworkError
};
