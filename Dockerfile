# dockerfile made mostly from here: 
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:alpine

# Create app directory and set pwd to it
WORKDIR /usr/src/app

# Install typescript
RUN npm install -g typescript

# Copy package and package-lock files
COPY package*.json ./

# Install packages in package.json
RUN npm install

# Copy app source
COPY . .

# Compile typescript to javascript
# (app compiles to ./dist directory)
RUN tsc

# Expose port 3000 to outside world
# -> when running "docker run", use flag
# -p YOUR_HOST_PORT:3000
# where YOUR_HOST_PORT will actually be
# visible to the world outside the host machine.
EXPOSE 3000

# Run node
CMD ["npm", "start"]
