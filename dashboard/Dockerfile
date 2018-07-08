# base image
FROM node:9.6.1

# set working directory
WORKDIR /app

#copy code from current folder to /app folder
ADD ./src /app
# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@1.1.1 -g --silent

# start app
CMD ["npm", "start"]