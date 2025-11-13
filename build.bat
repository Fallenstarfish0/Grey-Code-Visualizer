@echo off
echo Installing dependencies...
npm install

echo Building React app...
npm run build

echo Building executable...
npm run dist

echo Build complete! Check the dist folder for your executable.
pause