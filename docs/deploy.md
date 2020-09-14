# Deployment Instructions

This is a server-side version of the Dynamic Workflow application. You must host and deploy this application for it to work. There are many methods of deploying an application. In this example, I will be deploying it to Digital Ocean. Feel free to choose whichever platform/services and use this documentation as a guideline.

## Digital Ocean

1. Click create and select droplet
2. Choose an image. We will be going with Ubuntu 18.04.3 LTS x64
3. Choose a plan that best fits your business needs. For demo purposes, I will be choosing a Standard plan at $5/mo
4. Select your preferred datacenter region
5. Select any additional options
6. Choose an SSH for the authentication method
7. Create an SSH key for your droplet
8. Choose a hostname
9. Click create droplet
10. SSH into your server

## Node.js

```sh
# Refresh your local package index with the following command
sudo apt update

# Install Node.js from repositories
sudo apt install nodejs

# Install node packaging manager
sudo apt install npm
```

## Importing Source File

There are two options to import your source file.  Git or FTP.

1. **Git:** In the appropriate dir, execute `git clone {url_to_repo}`
2. **FTP:** You can use whichever tool you prefer tool, like [Cyberduck](https://cyberduck.io/).

### Install Dependencies

You will need to install all dependencies associated with this application

```sh
cd dynamic-workflow
npm install
```

### Dev Server w/ nodemon

Use nodemon as a dev node on production. *We will use pm2 as our process manager*

```sh
npm install -g nodemon
npm start dev # Use only for development
```

### Default port 80

To run application on default port 80 install lib2cap-bin

```sh
sudo apt-get install lib2cap-bin
sudo setcap cap/net/bind/service=+ep `readlink -f \`which node\``
```

### Prod Node w/ pm2

`pm2` is a tool for running production node servers.  Install pm2 to and run application in the background

```sh
sudo npm install pm2@latest -g

# Run production server
pm2 start ~/dynamic-workflow/server.js

# Run server on system reboot
pm2 startup systemd
```
