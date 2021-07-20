# Frontend client

## How to...

### ...build and run locally for development:

First it is recommended that the depending libraries are installed so that commands like ```webpack``` are ensured to work:

    $ yarn install

Then the Docker image must be built with:

    $ docker build -f Dockerfile.dev -t docker-client .

The newly created/updated Docker image can be seen in the list of registered Docker images with tag *docker-client* with:

    $ docker image ls

A Docker container can then be generated and started from this image with:

    $ docker run -it -v ${PWD}:/app -p 8081:8080 docker-client

The live environment can then be accessed at ```http://0.0.0.0:8081/``` (if it is a Linux environment) or at ```http://localhost:8081``` (if it is a Windows environment). The published files can be found in the ```client/build``` folder: it will contain the same content of the ```client/public``` folder with the addition of the three files bundled out by *webpack*: ```index.html```, ```bundle.js``` and ```bundle.js.map```.