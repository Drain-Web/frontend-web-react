# Frontend client

## How to...

### ...build and run locally for development:

If some change was performed in ```packages.json```, the file ```yarn.lock``` must be recriated with:

    $ yarn install

With ```yarn.lock``` in hands, the Docker image must be built with:

    $ docker build -f Dockerfile.dev -t docker-client .

And started with:

    $ docker run -it -v ${PWD}:/app -p 8081:8080 docker-client

The live environment can be accessed at ```http://0.0.0.0:8081/```. The published files can be found in the ```client/build``` folder: it will contain the same content of the ```client/public``` folder with the addition of the three files bundled out by *webpack*: ```index.html```, ```bundle.js``` and ```bundle.js.map```.