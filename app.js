const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
const { url } = require("inspector");

const app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
    //*****************************ENTER YOUR API KEY HERE******************************
     apiKey: "ac2ef85a28b550286de7fe65b2ba742f-us18",
    //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
     server: "us18"
    });

app.post("/",function(req,res){
    const firstname = req.body.fname ;
    const lastname = req.body.lname ;
    const email = req.body.email ;
    const listId = "469bbf72b9";

    const subscribingUser = {
        firstName: firstname,
        lastName: lastname,
        email: email
       };
       //Uploading the data to the server
        async function run() {
       const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
        FNAME: subscribingUser.firstname,
        LNAME: subscribingUser.lastname
       }
       });
       //If all goes well logging the contact's id
       if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
       }
       if (response.statusCode === 400) {
        res.sendFile(__dirname + "/failure.html");
       }
        
        console.log(
       `Successfully added contact as an audience member. The contact's id is ${
        response.id
        }.`
       );
       }
       //Running the function and catching the errors (if any)
       // ************************THIS IS THE CODE THAT NEEDS TO BE ADDED FOR THE NEXT LECTURE*************************
       // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
        run().catch(e => res.sendFile(__dirname + "/failure.html"));
       });

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function () {
    console.log("This server is run on port 3000");
})

//ac2ef85a28b550286de7fe65b2ba742f-us18
//469bbf72b9  