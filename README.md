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

### ...build/run the wrapper Docker container:

Running the command:

    $ docker-compose up

Will build, connect and launch the internal Docker containers altogether. Same as the other, it can then be accessed at ```http://0.0.0.0:8081```.

### ...deploy:

**TODO** - describe how to submit the container to a service like Heroku

## Versioning

The most important components for dev/deploy are listed below.

| Component       |  Version  | What                   |
|----------------:|:---------:|:-----------------------|
| NodeJS          |  14.17.3  |                        |
| Yarn            |   1.22.5  | NodeJS package manager |
| React           |   17.0.2  |                        |
| Docker          |  20.10.2  | Deployment manager     |
| Docker composer |   1.25.0  |                        |
