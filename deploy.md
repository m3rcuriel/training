```bash
ps ax # find and `kill -15` the `node` process
cd app-root/repo
rm -rf node_modules
npm install
npm install react-tools browserify envify sass uglifyjs uglify-js # is sass needed?
gem install sass
make server
```