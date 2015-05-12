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

If you want to run multiple instances of the socket.io server, use the following command to start and replace "port" with a different port number:
```
nodemon index port=3000 redis=localhost:6379 multi
```

Open browser to `localhost:3000`

_Note: Vagrant coming soon_
