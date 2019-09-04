const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { 'model': 'toyota', 'year': 1999, 'mpg': 23 },
  { 'model': 'honda', 'year': 2004, 'mpg': 30 },
  { 'model': 'ford', 'year': 1987, 'mpg': 14} 
]

const namesArray = [];

const server = http.createServer( function( request,response ) { //whenevr you do a fetch it goes to this function here
  if( request.method === 'GET' ) {
    handleGet( request, response )    //these can have many different options as well
  }else if( request.method === 'POST' ){
    console.log('we got to post if statement')
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }
  else if (request.url === '/getData'){ //when the html files asks for the data the server sends it back to them
      getData(request, response);
  }
  else{
    sendFile( response, filename )
  }
  //for other options expand this if statement
}

const getData = function(request, response) {
  request.on('end', function(){
     response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    const body = JSON.stringify(namesArray); 
    response.write(body);
    response.end();
  })
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  console.log('gets to before end');
  request.on( 'end', function() {
    console.log( JSON.parse( dataString ) )
    
    namesArray.push(JSON.parse( dataString ));
    //adds each name to an array held in the server

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end();
  });
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
