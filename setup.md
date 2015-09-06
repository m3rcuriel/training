# Dev environment for training app

Currently these instructions are for Mac OS X only. GNU/Linux users should be able to follow along pretty easily, generally replacing `brew` with `apt-get`/`yum`/etc. Both GNU/Linux and OS X have the unix-nature.

## Install homebrew
Open Terminal.app. Download and install homebrew (instructions from [brew.sh](http://brew.sh/)):
```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Make sure that you (1) follow all instructions and (2) do
```bash
brew doctor # check for postinstall problems
brew update # get notified of new packages
brew upgrade # download and install outdated packages
```

## Install git
```bash
brew install git
```

## Install rvm

```bash
\curl -sSL https://get.rvm.io | bash -s stable
# read the postinstall message VERY CAREFULLY and follow what it says to do
```

This will install `rvm`, which stands for "ruby version manager".

Next, install the Ruby version that we use and create a gemset for robotics:
```bash
rvm install ruby --latest
rvm gemset create firebots
rvm gemset use firebots
```

## Install npm and nodejs

```brew
brew install node
```

Aren't you glad you have homebrew?

## Clone the project

If you don't already have one, follow [these instructions](https://help.github.com/articles/generating-ssh-keys/) to generate an ssh key.
However, replace steps 3 and 4 with: go to https://gitlab.com/profile/keys/new to add a new ssh key. Title it whatever.
Type `cat ~/.ssh/id_rsa.pub` and paste the output of that command into the "key" field of the new ssh key screen.

I recommend making a folder under your home directory called "robotics" and cloning this project within the robotics folder. Better to keep all the robotics stuff in one place.
```bash
# if you don't have access, contact Logan
git clone git@github.com:glinia/training.git
cd training
```

## Install dependencies

```bash
# install javascript dependencies listed in package.json
npm install
# install build tools
sudo npm install -g react-tools@0.11.0 browserify@4.2.0 envify@2.0.0 clean-css@2.2.15

# install sass compiler & file watcher
rvm use 2.1.3
gem install sass watchr
```

## Make dev server

```bash
make dev
```

You should now be able to go to `localhost:5000` in your browser and see a development version of the training site!

**Note: You will not be able to do much with the training site unless you also have the API up and running on port 9977 locally.**
