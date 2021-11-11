#!/bin/bash

# Install node.js
# sudo apt-get install python-software-properties -y
# sudo apt-add-repository ppa:chris-lea/node.js -y
# sudo apt-get update
# sudo apt-get install nodejs -y
curl -fsSL https://rpm.nodesource.com/setup_12.x | sudo bash -
sudo yum install -y nodejs

# Install nodemon
# sudo npm install nodemon -g

# Install forever module 
# https://www.npmjs.com/package/forever
# sudo npm install forever -g

# Clean working folder
# sudo find /home/ubuntu/test -type f -delete