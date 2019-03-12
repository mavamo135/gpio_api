#!/usr/bin/env node
var Gpio = require('bonescript')
var http = require('http')
var url = require('url')

var state = [Gpio.LOW, Gpio.LOW, Gpio.LOW, Gpio.LOW]
var leds = ["USR0", "USR1", "USR2", "USR3"]

// Set as outputs and turn off all LEDs
for (var i in leds) {
    Gpio.pinMode(leds[i], Gpio.OUTPUT)
    Gpio.digitalWrite(leds[i], state[i])
}

http.createServer(function (req, res) {
    var urlReq = url.parse(req.url, true).pathname
    var query = url.parse(req.url, true).query
    switch(urlReq) {
        case '/USR0':
            res.writeHead(200, {'Content-Type': 'text/html'})
            setState(0, query.state) // Set state received from query
            break
        case '/USR1':
            res.writeHead(200, {'Content-Type': 'text/html'})
            setState(1, query.state) // Set state received from query
            break
        case '/USR2':
            res.writeHead(200, {'Content-Type': 'text/html'})
            toggle(2) // Toggle the LED USR2
            break
        default:
            res.writeHead(404, {'Content-Type': 'text/html'})
            res.write(req.url + ' Not Found!')
    }
    res.end()
}).listen(3001)

// Toggle LED USR3 every second
setInterval( () => {
    toggle(3)
}, 1000)

// Function used to toggle a LED state
function toggle(led) {
    state[led] = state[led] == Gpio.LOW ? Gpio.HIGH : Gpio.LOW
    Gpio.digitalWrite(leds[led], state[led])
}

// Function used to set a value to a LED
function setState(led, value) {
    state[led] = value == 1 ? Gpio.HIGH : Gpio.LOW
    Gpio.digitalWrite(leds[led], state[led])
}

// On CTRL+C stop the server and turn off all LEDs
process.on('SIGINT', function () {
    for (var i in leds) {
        Gpio.digitalWrite(leds[i], Gpio.LOW)
    }
    process.exit()
})