/* 
 * create and export configuration varialbes
 *
 */

// Container for all varaibles

const environments = {};

// Staging ( default ) environment 

environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'
};

// Production environment 

environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
};

// Determine which one to export 

const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check if provided environment match keys 

const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module 
module.exports = environmentToExport;