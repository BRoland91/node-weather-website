const path = require("path")
const express = require("express")
const hbs = require("hbs")
const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")

console.log(__dirname)
console.log(path.join(__dirname, "../public"))

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname, "../templates/views")
const partialPath = path.join(__dirname, "../templates/partials")

// Setup handlebars engine and views location
app.set("view engine", "hbs")
app.set('views', viewsPath);
hbs.registerPartials(partialPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Roland Bálint"
  })
})

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About page",
    name: "Roland Bálint"
  })
})

app.get("/help", (req, res) => {
  res.render("help", {
    message: "If you have any questions, please contact us.",
    title: "Help",
    name: "Roland Bálint"
  })
})

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Address must be provided."
    })
  }

  geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {
    if (error) {
     return res.send({
       error: error
     })
    }
    
    forecast(longitude, latitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error: error
        })
      }
      
      res.send({
        location,
        forecast: forecastData,
        address: req.query.address
      })
    })
  })
})

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term."
    })
  }

  console.log(req.query)
  res.send({
    products: []
  })
})

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Roland Bálint",
    errorMessage: "Help article not found."
  })
})

app.get("*", (req, res) => {
  res.render("404", {
    title: 404,
    name: "Roland Bálint",
    errorMessage: "Page not found."
  })
})

app.listen(port, () => {
  console.log("Server is up on port " + port + ".")
})
