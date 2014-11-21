ChessClient
========

A rich chess client designed to demonstrate the chessAPI at http://dxc4.com:8080
Demo: http://dxc4.com/

Set up
=========

install dependencies:

(requires ruby for sass gem)

```sh
npm install
npm install bower -g
bower install
gem install sass
```

build into dist folder:
```sh
gulp
```

Start server
==========

```sh
export CHESS_APP_PORT=80
node server.js
```

PM2 
=========

You can use PM2 to run the API which sports better logging, auto restarts, etc.. 
https://github.com/Unitech/PM2

Caveat: PM2 does not pass through enviroment variables so you will require to use a JSON config file like this:

```json
{
    "name"        : "Chess APP",
    "script"      : "server.js",
    "log_date_format"  : "YYYY-MM-DD HH:mm Z",
    "env": {
        "CHESS_APP_PORT": 80
```
    }
}
```
