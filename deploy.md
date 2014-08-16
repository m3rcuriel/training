```bash
ps ax # find and `kill -15` the `node` process
cd app-root/repo
rm -rf node_modules
npm install
npm install react-tools browserify envify uglifyjs uglify-js
make server
mkdir _dist
mkdir _dist/static
make server
```
