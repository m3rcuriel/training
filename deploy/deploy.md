Instructions to deploy this application to digitalocean.

`ssh root@111.111.111.111`

```bash
apt-get update && apt-get upgrade
```

then optionally (if you have `mosh` installed):
```bash
apt-get install mosh
```
then type `exit` then `mosh root@111.111.111.111`

---

```bash
mkdir /etc/nginx/ssl
cd /etc/nginx/ssl
nano STAR_fremontrobotics_com.crt
# paste in the cert
nano fremontrobotics.key
# paste in the key

rm /etc/nginx/nginx.conf
nano /etc/nginx/nginx.conf
# paste in the nginx.conf in this directory

# create an nginx user
useradd --no-create-home nginx

# after editing nginx
service nginx restart
```

Now, generate deploy keys...
```bash
ssh-keygen -t rsa -C "you@example.com"
# no passphrase, no etc
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa

cat ~/.ssh/id_rsa.pub
# paste this into deploy keys section in gitlab
```

```bash
# clone the project
git clone git@gitlab.com:loganh/training.git

# install rvm
\curl -sSL https://get.rvm.io | bash
source /etc/profile.d/rvm.sh
# install ruby
rvm install 2.1.1

# install npm and node
curl -sL https://deb.nodesource.com/setup | bash -
apt-get install nodejs
```

```bash
cd training

# install from package.json
npm install
# install compiling tools
npm install -g react-tools browserify envify clean-css

# install sass compiler
gem install sass

# start the server!
make file-structure
make server NODE_ENV=production

# once you've ensured that the server is running properly,
# press `ctrl-c` a few times, then...
./restart.sh
```
