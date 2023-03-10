const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https=require("https");
const app = express();
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));//this help to access the file of css and images bcz this webpage is static.
app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function (req,res){
    const firstname=req.body.fname;
    // console.log(firstname);
    const lastname=req.body.lname;
    // console.log(lastname);
    const email=req.body.email;
    // console.log(email);

    const data={
        members: [
            {
                email_address:email,
                status:"subscribed",
                merge_fields: {
                    FNAME:firstname,
                    LNAME:lastname,
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data); 
 
    const url = "https://us21.api.mailchimp.com/3.0/lists/" + process.env.MC_LIST_ID;

    const options={
        method: "POST",
        auth: process.env.MC_API_KEY,
        body: jsonData
    }

    const request = https.request(url,options,function (response) {

        if(response.statusCode === 200 ){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});



app.post("/failure",function(req,res){
    res.redirect("/");
})

const port = process.env.PORT || 3000
app.listen(port, function () {
    console.log("server runnings on " + port)
})
