var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;

var handlers = {};

handlers.hello = function(callback){
	var payload = {'message':'Welcome to my first node js server'};
	callback(200, payload);
}
handlers.default = function(callback){
	var payload = {'error': 'Resource not available'};
	callback(404, payload);
}
var routes = { 'hello': handlers.hello,
				'default': handlers.default
			 };

var server = http.createServer(function(req, res){
	
	var parsedUrl = url.parse(req.url, true);

	var path = parsedUrl.pathname;
    console.log('A request came and path is ', path.replace('\/',''));
    

    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
    	
    	buffer += decoder.write(data);
    });

    req.on('end', function(){
    	buffer += decoder.end();
    	console.log('Inside end event');
    	var trimmedPath = path.replace('\/','');
    	var chosenHandler = typeof(routes[trimmedPath]) !== 'undefined' ? routes[trimmedPath] : routes.default;
    	chosenHandler(function(status, payload){
    		res.writeHead(status, {'Content-Type': 'application/json'})
    		res.end(JSON.stringify(payload));
    	});
    });

});


server.listen(3000, function(){
	console.log("Listening on port 3000");
});
