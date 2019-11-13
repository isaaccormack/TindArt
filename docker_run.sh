#! /bin/sh

# Runs the docker server. Requires a built tindart/webserver:latest image.

# Remove existing webserver container if one exists
docker rm tindart-webserver > /dev/null 2>&1 

# Start webserver on port 3300
docker run -p 3300:3000 --name "tindart-webserver" tindart/webserver:latest
