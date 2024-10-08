const express=require("express")
const database=require("./config/database");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

var cors = require('cors')

require("dotenv").config();
database.connect();
const app=express();
// parser apllication/json
app.use(bodyParser.json());
app.use(cors())
// cookie-parser
app.use(cookieParser("AB"));
const port=process.env.PORT;
const routesApiV1 = require("./ap1/v1/routes/index.routes");
routesApiV1(app);
app.listen(port,()=>{
  console.log(`App listening on port ${port}`)
})