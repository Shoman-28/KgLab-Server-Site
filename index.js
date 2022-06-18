const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const { MongoClient, ServerApiVersion } = require('mongodb');
// const ObjectId =require('mongodb').ObjectId;
require('dotenv').config();


app.use(express.json())
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = process.env.PORT || 5500;



app.get("/", (req, res) => {
  res.send("Hello World!");
});




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ibixa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


client.connect(err => {
 
  const addAppointmnetCollection = client.db("doctors").collection("addAppointments");
  const doctorCollection = client.db("doctors").collection("doctorDetails");
  const adddoctorCollection = client.db("doctors").collection("addDoctor");

  //   //Post Add Appointment
  app.post("/addAppointmnet", (req, res) => {
    addAppointmnetCollection.insertOne(req.body)    
      .then((result) => {
        res.send(result.insertedCount > 0);
      })
      .catch((err) => {
        console.log(err, "error message");
      });
  });
  

  //   //Get All Appointment
  app.get("/allAppointments", (req, res) => {
    addAppointmnetCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
    
  });
  
  
   //Post Add Doctore
  app.post('/addADoctore',  (req, res) =>{    
    doctorCollection.insertOne(req.body)    
      .then(result=>{
      res.send(result.insertedCount > 0)
      })
      .catch(err=>{
        console.log(err, "error message")
      })
      
    })
 //Get All Appointment
 app.get("/allDoctor", (req, res) => {
  console.log(res)
  doctorCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents);
  })
  
});


 


  app.post('/appointmentsByDate', (req, res)=>{
      const date = req.body;
      const email = req.body.email;      
      doctorCollection.find({email: email})
        .toArray((err, doctors)=>{
            const filter = {date: date.date}
            if(doctors.length === 0){
              filter.email = email;
            }
            addAppointmnetCollection.find(filter)
            .toArray((err, documents)=>{
              console.log(email, date.date, doctors, documents)
                res.send(documents);
            })
        })
     
  })

  app.post('/checkAdmin', (req, res)=>{
    doctorCollection.find({email:req.body.email})
    .toArray((err, documents)=>{
      res.send(documents)          
      
    })
    
  })

  


});



// app.listen(port, () => {
//   console.log("successfully digital server site");
// });
// app.listen(process.env.PORT || port)
// app.listen(process.env.PORT ||port);
app.listen(port, () => {
  console.log(`successfully KgLab app daploy at http://localhost:${port}`);
});