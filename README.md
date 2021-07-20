# Frontend - Web - React

Frontend for web browsers based on NodeJS React.

The effective content of the project is in the folder ```client```. The folder ```helloworld```, as it can be imagined, contains only the minimal amount of files needed to start a production pipeline with the libraries chosen.

## How to...

### ...build and run locally for development:

Please see instructions in ```client/README.md```.

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

Once all local changes are made, they need to be *git commited* and then pushed to the Heroku remote repository with:

    $ git push heroku [your_dev_branch]:main

If everything worked fine, the system was built and deployed after the git push and it can be accessed at [https://drain-web.herokuapp.com/](https://drain-web.herokuapp.com/).

Once you are confortable with your published changes, don't forget to commit them to the Git repository used for development<sup>*</sup>:

    $ git push origin [your_dev_branch]:[your_dev_branch]
    $ git push origin [your_dev_branch]:develop

<sup>\*</sup>: If the changes did locally were not deployed, only push to your remote *\[your_dev_branch\]*. The remote *develop* branch is expected to be synch with the content deployed on Heroku.

**NOTE:** Instead of using a Docker compose manifest (```docker-compose.yml```) to build up multiple Docker containers, Heroku uses its own manifest, ```heroku.yml```, which must be in the root directory of the git repository. It uses ```Dockerfile``` files instead of the ```Dockerfile.dev```, which is expected to be used solely for local development.

## Versioning

The most important components for dev/deploy are listed below.

| Component       |  Version  | Description                                      |
|----------------:|:---------:|:------------------------------------------|
| NodeJS          |  14.17.3  | Server-side JavaScrip runtime environment |
| Yarn            |   1.22.5  | NodeJS package manager                    |
| React           |   17.0.2  | JavaScript library for User Interfaces    |
| Docker          |  20.10.2  | Deployment manager                        |
| Webpack         |   5.45.1  | Module blunder and local development server |