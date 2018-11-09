/* 
    Primary file for the API
*/

// Dependencies

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should response to all requests with a string
const server = http.createServer( (req, res) => {
    // get the url an parse it
    const parsedUrl = url.parse(req.url, true);

    // get the path from that url 
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get query string object
    const queryStringObject = parsedUrl.query;
    
    // get the HTTP method
    const method = req.method.toLocaleLowerCase();

    // get request headers
    const headers = req.headers;

    // get the payload if there is any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer = decoder.end();

        // Choose the handler this request should go to if one is not found use the NotFound handler
        const choosenHandler = router[trimmedPath] ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to pass into hadnler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: buffer,
        };

        // Route the request ti the handler specified in the router
        choosenHandler(data, (statusCode, payload) => {
            // use the status code called back from the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200; 
            // use the payload called back from the handler or default to empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // stringify payload
            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

             // log the request path
            console.log('Returning this response: ', statusCode, payloadString);
        });

    });
});

// Start the server and listen on port 3000
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

// Define Handlers
const handlers = {};


// Sample handler
handlers.sample = (data, callback) => {
    // Callback HTTP status code and payload object
    callback(406, {name: 'sample handler'});
};

// NotFound handler

handlers.notFound = (data, callback) => {
    callback(404);
};

// Define a request router 

const router = {
    'sample': handlers.sample
};