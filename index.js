var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;

var handlers = {};

handlers.hello = function(callback){
	var payload = {'message':'Welcome to my first node js server'};
	callback(200, payload);
}
var routes = { 'hello': handlers.hello};

var server = http.createServer(function(req, res){
	
	var parsedUrl = url.parse(req.url, true);

	var path = parsedUrl.pathname;
    console.log('a request came and path is ', path.replace('\/',''));
    res.writeHead(200, {'Content-Type': 'application/json'})

    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
    	
    	buffer += decoder.write(data);
    });

    req.on('end', function(){
    	buffer += decoder.end();
    	console.log('inside end event');
    	var trimmedPath = path.replace('\/','');
    	var chosenHandler = typeof(routes[trimmedPath]) !== 'undefined' ? routes[trimmedPath] : routes.hello;
    	chosenHandler(function(status, payload){
    		res.end(JSON.stringify(payload));
    	});
    });

});


server.listen(3000, function(){
	console.log("Listening on port 3000");
});