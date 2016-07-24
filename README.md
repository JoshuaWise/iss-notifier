# ISS Notifier

This is a simple webapp demonstration that allows you to see when the ISS will be overhead at specific locations.

It uses the LocalStorage API to locally save locations that you are interested in. While the webapp is open, you'll see how much time is left until the next ISS flyby at each location.

When the ISS is overhead a location, you'll see a countdown for how much time is left until the ISS is no longer overhead that location. When that countdown is over, the next flyby time will be retrieved and displayed—and the cycle repeats.

All of this information is also provided automatically for your current location (provided that you allow your browser to use geolocation).

## Installation

1. Make sure you have at least version 4.x of Node.js installed
2. `git clone` this repository, and `cd` to it
3. `npm install`
4. `node server`
5. Navigate to `http://localhost:7000` in your browser
6. Enjoy

## Development

If you plan to edit the source code, you'll need to run `gulp` after each time you change an SCSS or JS file. Alternatively, you can run `gulp watch`, to have it automatically watch your files and process them as needed.

You can install the gulp CLI tool by running: `npm install -g gulp`
