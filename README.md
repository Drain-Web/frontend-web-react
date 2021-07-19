# Frontend - Web - React

Frontend for web browsers based on NodeJS React.

## How to...

The follwoing commands should start from the root directory of the cloned repository.

### ...build/run one of the NodeJS components locally:

Prior to building the Docker image, one *can* install a component with:

    $ cd helloworld/
    $ yarn install

After installed, it can be initiated with:

	$ yarn start

The result can be accessed at ```http://0.0.0.0:8080```.

This step may be useful during development for debugging.

### ...build/run one of the internal Docker containers:

A Docker image can be created with:

    $ cd helloworld/
    $ docker build -f Dockerfile.dev -t docker-helloworld .

The image with tag *docker-helloword* can be seen in the list of registered Docker images with:

    $ docker image ls

And it can be initiated with:

    $ docker run -it --rm -v ${PWD}:/app -p 8081:8080 docker-helloworld

As the Docker container maps external port 8081 to internal port 8080, it can be accessed at ```http://0.0.0.0:8081```.

### ...build/run the wrapper Docker composer:

Running the command:

    $ docker-compose up

Will build, connect and launch the internal Docker containers altogether. Same as the other, it can then be accessed at ```http://0.0.0.0:8081```.

### ...deploy:

[Heroku](https://heroku.com/) is used as the cloud storage and service provider of the project.

Before deploing to Heroku, ensure you have:

1. the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) app installed in your machine; and
2. that you have a Heroku user with access to the ```drain-web``` Heroku app.

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

| Component       |  Version  | What                                      |
|----------------:|:---------:|:------------------------------------------|
| NodeJS          |  14.17.3  | Server-side JavaScrip runtime environment |
| Yarn            |   1.22.5  | NodeJS package manager                    |
| React           |   17.0.2  | JavaScript library for User Interfaces    |
| Docker          |  20.10.2  | Deployment manager                        |
| Docker composer |   1.25.0  | Development environment                   |
