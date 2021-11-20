require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const { v4: uuidv4 } = require("uuid")

const app = express()
const port = process.env.PORT

let users = []
let logs = []
 
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html")
})

app.route("/api/users")
.get((req, res) => {
	res.json(users)
})
.post((req, res) => {
	let username = req.body.username
	let id = uuidv4()
	let user = {username: username, _id: id}

	users.push(user)
	res.json(user)
})

app.post("/api/users/:_id/exercises", (req, res) => {
	let id = req.params._id
	let description = req.body.description
	let duration = req.body.duration
	let date = new Date(req.body.date)

	if (date == "Invalid Date") date = new Date()	

	let user = users.find(v => v._id == id)	
	if (user) {
	    	let count = user.count || 0
	    	user.log = user.log || []

	    	user.count = ++count
	    	user.log.push({
	      		description: description,
	      		duration: duration,
	      		date: date.toDateString()
	    	})
	    	logs.puch({..user})
		
		res.json({
			username: user.username,
			description: description,
			duration: +duration,
			date: date.toDateString(),
			_id: user._id
		})
	} else {
		res.json({
			error: "user does not exist"
		})
	}
})

app.get("/api/users/:_id/logs", (req, res) => {
	let id = req,params._id
	let fromDate = req.query.from || new Date(0)
	let toDate = req.query.to || new Date()
	
	let log = logs.find(v => v._id == id)
	let logLimit = req.query.limit || log.log.length

	let filteredLog = log.log.filter(({date}) => new Date(date) >= new Date(fromDate) && new Date(date) <= new Date(toDate)).slice(0, logLimit)

	res.json({
		username: log.username,
		count: log.count,
		_id: log._id,
		log: filteredLog
	})
})

app.listen(port, () => {
	console.log(`listening at port: ${port}`)
})
