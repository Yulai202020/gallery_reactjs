npm run build
rm -fr ../server/build
mv build ../server
cd ../server
node App.js