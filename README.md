
# parse-server-web
基于parse-server和webpack构建的全栈工程
=======

Example project using the [parse-server](https://github.com/ParsePlatform/parse-server) module on Express.

Read the full Parse Server guide here: https://github.com/ParsePlatform/parse-server/wiki/Parse-Server-Guide

### For Local Development

* Make sure you have at least Node 4.3. `node --version`
* Clone this repo and change directory to it.
* `npm install`
* Install mongo locally using http://docs.mongodb.org/master/tutorial/install-mongodb-on-os-x/
* Run `mongo` to connect to your database, just to make sure it's working. Once you see a mongo prompt, exit with Control-D
* Run the server with: `npm start`
* By default it will use a path of /parse for the API routes.  To change this, or use older client SDKs, run `export PARSE_MOUNT=/1` before launching the server.
* You now have a database named "dev" that contains your Parse data
* Run the web with: `npm run start-web`
* Use browser open [http://localhost:8080]
    
# Using it

Before using it, you can access a test page to verify if the basic setup is working fine [http://localhost:1337/test](http://localhost:1337/test).
Then you can use the REST API, the JavaScript SDK, and any of our open-source SDKs:

Example request to a server running locally:

```curl
curl -X POST \
  -H "X-Parse-Application-Id: myAppId" \
  -H "Content-Type: application/json" \
  -d '{"score":1337,"playerName":"Sean Plott","cheatMode":false}' \
  http://localhost:1337/parse/classes/GameScore
  
curl -X POST \
  -H "X-Parse-Application-Id: myAppId" \
  -H "Content-Type: application/json" \
  -d '{}' \
  http://localhost:1337/parse/functions/hello
```

Example using it via JavaScript:

```javascript
Parse.initialize('myAppId','unused');
Parse.serverURL = 'https://whatever.herokuapp.com';

var obj = new Parse.Object('GameScore');
obj.set('score',1337);
obj.save().then(function(obj) {
  console.log(obj.toJSON());
  var query = new Parse.Query('GameScore');
  query.get(obj.id).then(function(objAgain) {
    console.log(objAgain.toJSON());
  }, function(err) {console.log(err); });
}, function(err) { console.log(err); });
```

Example using it on Android:
```java
//in your application class

Parse.initialize(new Parse.Configuration.Builder(getApplicationContext())
  .applicationId("myAppId")
  .server("http://myServerUrl/parse/")   // '/' important after 'parse'
  .build());

ParseObject testObject = new ParseObject("TestObject");
testObject.put("foo", "bar");
testObject.saveInBackground();
```
Example using it on iOS (Swift):
```swift
//in your AppDelegate

Parse.initializeWithConfiguration(ParseClientConfiguration(block: { (configuration: ParseMutableClientConfiguration) -> Void in
  configuration.server = "https://<# Your Server URL #>/parse/" // '/' important after 'parse'
  configuration.applicationId = "<# Your APP_ID #>"
}))
```
You can change the server URL in all of the open-source SDKs, but we're releasing new builds which provide initialization time configuration of this property.

As of April 5, 2017, Parse, LLC has transferred this code to the parse-community organization, and will no longer be contributing to or distributing this code.
