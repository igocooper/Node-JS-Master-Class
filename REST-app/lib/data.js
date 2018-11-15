/*
 * Library for storing and editing data
 *
*/

const fs = require('fs');
const path = require('path');

// Container for this module
var lib = {};

// Base directory 
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to file
lib.create = function(dir, file, data, callback) {
    // try to open the file for writing
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', function(err, fileDescriptor){
        if(!err && fileDescriptor) {
            // convert data to string 
            const stringData = JSON.stringify(data);
            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err){
                if(!err) {
                    fs.close(fileDescriptor, function(err){
                        if(!err) {
                            callback(false);
                        } else {
                            callback('Error closing new File');
                        }
                    });
                } else {
                    callback('Error writting to new file');
                }
            })
        } else {
            callback('Could Not create new file. It may already exist');
        }
    });
};

// Read data fro a file

lib.read = function(dir, file, callback) {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', function(err, data){
        callback(err, data);
    });
};

// Update existing data

lib.update = function(dir, file, data, callback){
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', function(err, fileDescriptor) {
        if(!err && fileDescriptor) {
            // convert data to string 
            const stringData = JSON.stringify(data);

            // Truncate the content of the file before writing to it
            fs.truncate(fileDescriptor, function(err) {
                if(!err) {                    
                    // Write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, function(err){
                        if(!err) {
                            fs.close(fileDescriptor, function(err){
                                if(!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing the file');
                                }
                            })
                        } else {
                            callback('Error writing to the existing file');
                        }
                    });
                } else {
                    callback('Error truncating file');
                }
            });
        } else {
            callback('Could not open the file for updating');
        }
    });
};

// Delete data

lib.delete = function(dir, file, callback) {
    // Unlink the file 
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, function(err) {
        if(!err){
            callback(false);
        } else {
            callback('Error while deleting file');
        }
    });
}

// Export the module
module.exports = lib;