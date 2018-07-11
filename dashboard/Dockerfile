FROM node:9.6.1

# set working directory
WORKDIR /app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/src/package.json
RUN npm install 
RUN npm install react-scripts@1.1.1 -g

# start app
CMD ["npm", "start"]

EXPOSE 3000