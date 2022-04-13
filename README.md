# Frontend - Web - React

Frontend for web browsers based on NodeJS React.

The effective content of the project is in the folder ```client```. The folder ```helloworld```, as it can be imagined, contains only the minimal amount of files needed to start a production pipeline with the libraries chosen.

## How to...

### ...follow the project's coding standars:

The project follows the [JavaScript Standard Style](https://standardjs.com/), which has a verification/fixing tool and a [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=standard.vscode-standard).

Before *git commiting*, please validate the codes in ```src``` with a command such as:

    $ npx standard client/src/*.js

If there are many issues, they can be fixed with:

    $ npx standard client/src/*.js --fix

### ...build and run locally for development:

Please see instructions in ```client/README.md```.

### ...set up multi layers vectorial layers for the streams in the local server

Suppose all streams you want are in the ```my_streams.geojson``` file. Suppose thata the atribute ```name``` of this file is ```myFeatureName``` and each stream has at least two attributes: ```stream_id``` and ```horton_order``` (names self-explanatory).

First, these streams need to be converted into protobuffer format and saved in a new folder ```my_streams_tiled```:

```
$ ogr2ogr -f MVT my_streams_tiled my_streams.geojson -dsco MINZOOM=0 -dsco MAXZOOM=18 -dsco COMPRESS=NO
```

The, the local tiles server must be activated for access at ```http://localhost:8082/``` running a script with the following Python code:

```
#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import sys

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

if _name_ == '_main_':
    test(CORSRequestHandler, HTTPServer, port=int(sys.argv[1]) if len(sys.argv) > 1 else 8082)
```

Before starting the frontend server, the subfields of ```stream_network``` in the ```public/settings.config``` file must be changed, specially (for our case example):

- ```layer_names```: ["myFeatureName"];
- ```vector_attributes.id```: "stream_id";
- ```vector_attributes.stream_order```: "horton_order".

### ...deploy:

[Heroku](https://heroku.com/) is used as the cloud storage and service provider of the project.

Before deploing to Heroku, ensure you have:

1. the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) app installed in your machine; and
2. a Heroku user with access to the ```drain-web``` Heroku app.

Once the abovementioned criteria are match and the repository content was cloned into your machine (and you checked out to your personal sandbox branch referred here by *[your_dev_branch]*), in the terminal go to the root of your local repository and log in into your Heroku account with the command:

    $ heroku login

Deploys on Heroku are triggered after any Git commit to the ```main``` branch of their remote repository. To include the reference for ther remote repository into your local repository, use the command:

    $ heroku git:remote -a drain-web

Now we should have at least two remote repositories: ```origin``` (refers to the GitHub repo) and ```heroku```. This can be confirmed with:

    $ git remote -v

Once all local changes are made, they need to be *git commited* with the classical command:

    $ git commit -a -m "Some description of your changes"

Next step is to push the changes to Heroku remote git repository. Heroku is set up to build the Docker just after it receives the git push. In the build process, Heroku maintains a *build cache* to speed things up. Sometimes the cache needs to be cleaned up with:

    $ heroku builds:cache:purge -a drain-web

And then the changes should be pushed to the Heroku remote repository with:

    $ git push heroku [your_local_dev_branch]:main

If everything worked fine, the system was built and deployed after the git push and it can be accessed at [https://drain-web.herokuapp.com/](https://drain-web.herokuapp.com/).

Once you are confortable with your published changes, don't forget to commit them to the Git repository used for development<sup>*</sup>:

    $ git push origin [your_dev_branch]:[your_dev_branch]
    $ git push origin [your_dev_branch]:develop

<sup>\*</sup>: If the changes did locally were not deployed, only push to your remote *\[your_dev_branch\]*. The remote *develop* branch is expected to be synch with the content deployed on Heroku.

**NOTE:** Instead of using a Docker compose manifest (```docker-compose.yml```) to build up multiple Docker containers, Heroku uses its own manifest, ```heroku.yml```, which must be in the root directory of the git repository. It uses ```Dockerfile``` files instead of the ```Dockerfile.dev```, which is expected to be used solely for local development.

## Versioning

The most important components for dev/deploy are listed below.

| Component       |  Version  | Description                                 |
|----------------:|:---------:|:--------------------------------------------|
| NodeJS          |  14.17.3  | Server-side JavaScrip runtime environment   |
| Yarn            |   1.22.5  | NodeJS package manager                      |
| React           |   17.0.2  | JavaScript library for User Interfaces      |
| Docker          |  20.10.2  | Deployment manager                          |
| Webpack         |   5.45.1  | Module blunder and local development server |
| Bootstrap       |    5.0.2  | CSS framework for responsive interfaces     |