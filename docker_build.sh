#! /bin/sh

# Cleans the images and containers from the previous docker run (if any),
# then builds the image and runs the server.
# Clean steps have their output redirected to /dev/null

# Retag existing webserver image to be easier to find and remove later,
# even after building another image with the same tag.
docker tag tindart/webserver:latest tindart/webserver:old > /dev/null 2>&1
# Remove existing webserver container
docker rm tindart-webserver > /dev/null 2>&1 

# Build webserver image
docker build -t tindart/webserver:latest .

# Remove old webserver image. We do this after building a new copy
# because we want to ensure that the cache exists in case the new
# build can use it.
docker rmi tindart/webserver:old > /dev/null 2>&1
