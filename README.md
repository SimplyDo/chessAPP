dxc4.com Demo Client App
========

A rich chess client based on the dxc4 chess API available at http://api.dxc4.com (see [interactive documentation](http://apidocs.dxc4.com/dxc4))

See it in action at: http://dxc4.com/


Set up
=========

install dependencies:

(requires ruby for sass gem and node/npm)

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

Analytics
==========

Any content matching app/tracking/*.html will be injected into the apps \<head\> tag by gulp. You can use this to add JS tracking to the app. At the moment the app sends certain events to mixpanel IF you add the appropiate script there.


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
    }
}
```
