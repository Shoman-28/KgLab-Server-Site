const express = require("express");
// const bodyParse = require("body-parser");
const app = express();
const cors = require("cors");
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri =
  "mongodb+srv://doctor:P1RgsEhAGyptNQSx@cluster0.2nz5u.mongodb.net/doctors?retryWrites=true&w=majority";



app.use(express.json())
// app.use(bodyParse.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());


const port = 5500;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

client.connect((err) => {
  const addAppointmnetCollection = client.db("doctors").collection("addAppointments");
  const doctorCollection = client.db("doctors").collection("doctorDetails");
  const adddoctorCollection = client.db("doctors").collection("addDoctor");


  //Post Add Appointment
  app.post("/addAppointmnet", (req, res) => {
    addAppointmnetCollection.insertOne(req.body)    
      .then((result) => {
        res.send(result.insertedCount > 0);
      })
      .catch((err) => {
        console.log(err, "error message");
      });
  });

  
  //Get All Appointment
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
  
//   app.post('/addADoctor', (req, res) => {
//     const file = req.files.file;
//     const name = req.body.name;
//     const email = req.body.email;
//     const newImg = file.data;
//     const encImg = newImg.toString('base64');

//     var image = {
//         contentType: file.mimetype,
//         size: file.size,
//         img: Buffer.from(encImg, 'base64')
//     };

//     doctorCollection.insertOne({ name, email, image })
//         .then(result => {
//             res.send(result.insertedCount > 0);
//         })
// })


  // app.post('/addADoctore', (req, res)=>{
  //   const file = req.files.file;
  //   const name = req.body.name;
  //   const email = req.body.email;
  //   // const newImg = files.data;
  //   // const encImg = newImg.toString('base64');
    
  //  const filePath = `${__dirname}/doctors/${file.name}`;
  //   file.mv(filePath, err=>{
  //     if(err){
  //       console.log(err)
  //       return res.status(500).send({msg: 'Failed to upload Image'});
  //     }
    
  //   const newImg = fs.readFileSync();
  //   const encImg = newImg.toString('base64');
  //   var image={
  //     // contentType:file.mimetype,      
  //     // size:file.size,
  //     contentType:req.files.file.mimetype,
  //     size:req.files.file.size,
  //     img: Buffer.from(encImg, 'base64')
  //   }


  //     doctorCollection.insertOne({ name, email, image })
  //     .then(result => {
  //       fs.remove(filePath, error=>{
  //         if(error){
  //           console.log(error)
  //           return res.status(500).send({msg: 'Failed to upload Image'});
  //         }
  //         res.send(result.insertedCount > 0);
  //       })
          
  //     })
  //   })


    // doctorCollection.insertOne({ name, email })
    //         .then(result => {
    //             res.send(result.insertedCount > 0);
    //         })

    
    
  // })


});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// app.listen(process.env.PORT ||port);
