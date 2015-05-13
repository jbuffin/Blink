# Blink

## Getting started

If you don't have redis installed, install it:
```
brew install redis
redis-server
```

```bash
npm install -g nodemon
npm install
nodemon index
```

If you want to run multiple instances of the socket.io server, you'll need to do the following: 

If you don't have redis installed, install it:
```
brew install redis
redis-server
```

Then, start the different node servers with a different port number for each:
```
nodemon index port=3000 redis=localhost:6379
```

Open browser to `localhost:3000`

_Note: Vagrant coming soon_

##API

###`POST /events`

Takes JSON of the form:
```json
{
  "room": "room_name",
  "data": DATA_OBJECT
}
```

