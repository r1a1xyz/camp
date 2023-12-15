let express = require('express')
let api = express()

api.use(function(req, res) {
    let currDate = new Date()
    console.log( req.method+" "+req.path+" - "+req.ip+ " " + " | " + currDate.getHours() + ":" + currDate.getMinutes() + ":" + currDate.getSeconds() )
});

api.get('/', function (req, res, next) {
    res.sendFile(__dirname + "/views/index.html")
})

// Parameters can be suffixed with a question mark ( ? ) to make the parameter optional

api.get("/api/timestamp-microservice/:date?", (req, res) => {
    
    let dateReq, dateObj

    /* 
    The input arrives in the form of a string. While the new Date() function adeptly transforms it into a date, 
    it encounters difficulty when the string resembles a numeric value or Unix timestamp. 
    */
    
    if(!req.params.date) {
        dateObj = new Date()
        res.json({ unix: dateObj.getTime(), utc: dateObj.toUTCString() })
    } else {
        dateReq = isNaN(req.params.date) ? req.params.date : parseInt(req.params.date)
        dateObj = new Date(dateReq)
        if(dateObj.toUTCString() === "Invalid Date") {
            res.json({ error : "Invalid Date" })
        } else {
            res.json({ unix: dateObj.getTime(), utc: dateObj.toUTCString() })
        }
    }
     
})

api.get("/api/request-header-parser/whoami", (req, res) => {
    let clientHeaders = req.headers
    let clientIP = req.socket.remoteAddress.replace(/^.*:/, "")  // removing ::ffff:

    res.json({ ipaddress: clientIP, language: clientHeaders["accept-language"], software: clientHeaders["user-agent"] })
})

module.exports = api