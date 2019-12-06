# Dockerfile from node-alpine for smaller-sized images
FROM node:12-alpine

# Add python and make for building bcrypt
RUN apk add build-base python3

# Create app directory and set pwd to it
WORKDIR /usr/src/app

# Copy package and package-lock files
COPY package*.json ./

# Install packages in package.json
RUN npm install

# Copy app source
COPY . .

# Compile typescript to javascript
RUN npm run build-ts

# Expose port 3000 to outside world
EXPOSE 3000

# Run node
CMD ["npm", "start"]
