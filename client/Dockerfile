# BASED ON: https://dev.to/levelupkoodarit/deploying-containerized-nginx-to-heroku-how-hard-can-it-be-3g14
# BASED ON: https://typeofnan.dev/how-to-serve-a-react-app-with-nginx-in-docker/
FROM node:14.17.3 AS build-stage

# gets the port dynamically assigned by Heroku in thoe $PORT variable
ARG PORT

# define working directory
WORKDIR /app

# add the binaries from node_modules to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install application dependencies
COPY package.json ./
COPY yarn.lock ./

# add app
COPY . .

# install and build the app
RUN yarn install --frozen-lockfile && yarn build

########################################################################

# start NGINX
FROM nginx:alpine

# Set working directory to nginx asset directory and clean it
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# get the content
COPY --from=build-stage /app/build .

# 
# ENTRYPOINT ["nginx", "-g", "daemon off;"]

# get the 'nginx.conf' in the root folder of the project
COPY nginx.conf /etc/nginx/conf.d/default.conf

# for local runs
# CMD nginx -g 'daemon off;'

# for Heroku runs
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
