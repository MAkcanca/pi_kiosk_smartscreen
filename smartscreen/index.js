const express = require('express');
const path = require('path');
const shellExec = require('shell-exec')
const Gpio = require('onoff').Gpio
const app = express();
const fs = require('fs')
const request = require('request')

const port = 3141;
const SERVER_URL = "https://powerful-spire-14422.herokuapp.com"

var redLED = new Gpio(21, 'out');
var greenLED = new Gpio(14, 'out');
var blueLED = new Gpio(15, 'out');
var pushButton = new Gpio(20, 'in', 'both');
var has_reset = false
var time = 0


const download = (url, save_loc, callback) => {
    request.head(url, (err, res, body) => {
        request(url)
            .pipe(fs.createWriteStream(save_loc))
            .on('close', callback)
    })
}

pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
    if (err) { //if an error
        console.error('There was an error', err); //output error message to console
        return;
    }
    if (value == 1) {
        time = Date.now()
    } else {
        var pressedTime = Date.now() - time
        if (pressedTime > 5000 && pressedTime < 12000) {
            shellExec('sudo /bin/bash /home/pi/smartscreen/remove_file.sh')
                .then(() => {
                    resetLeds()
                    has_reset = true
                    redLED.writeSync(0)
                    resetLeds()
                    redLED.writeSync(0)
                })
        }
    }
    console.log(value)
});

function resetLeds() {
    redLED.writeSync(1)
    greenLED.writeSync(1)
    blueLED.writeSync(1)
}

function hasInternet(cb) {
    require('dns').resolve('www.google.com', function (err) {
        if (err) {
            resetLeds()
            redLED.writeSync(0)
            resetLeds()
            redLED.writeSync(0)
            cb(false)
        } else {
            resetLeds()
            greenLED.writeSync(0)
            resetLeds()
            greenLED.writeSync(0)
            cb(true)
        }
    });
}

app.get('/store_image', function (req, res) {
    var url = req.query.url
    //var filename = url.split("/")
    //filename = filename[filename.length - 1]
    var save_loc = path.join(__dirname, '/public/cache.jpg')
    download(url, save_loc, () => {
        res.send("Done")
    })
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/server_info', function (req, res) {
    res.json({ server_url: SERVER_URL })
});

app.get('/has_internet', function (req, res) {
    if (has_reset) {
        hasInternet(status => res.json({ has_internet: status, has_reset: true }))
        has_reset = false
    } else {
        hasInternet(status => res.json({ has_internet: status, has_reset: false }))
    }
});

app.get('/device_id', function (req, res) {
    shellExec('vcgencmd otp_dump | grep \'28:\'')
        .then((obj) => {
            var device_id = obj.stdout.substr(obj.stdout.length - 6)
            res.send(device_id)
        })
        .catch(console.log)
});

// sendFile will go here
app.use('/static', express.static('public'))

app.listen(port);
console.log('Server started at http://localhost:' + port);
