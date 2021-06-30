const express = require('express');
const cors = require('cors');
const bodyParse = require('body-parser');

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://doctor:P1RgsEhAGyptNQSx@cluster0.2nz5u.mongodb.net/doctors?retryWrites=true&w=majority";

const app = express();


const port = 3000

app.use(cors());
app.use(bodyParse.json());


app.get('/', (req, res) => {
    res.send('Hello World!ddsdfdsa')
  })
  
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const addAppointmnetCollection = client.db("doctors").collection("addAppointments");
  app.post('/addAppointmnet', (req, res)=>{
    addAppointmnetCollection.insertOne(req.body)
      .then(result =>{
          res.send(result.insertedCount>0)
      }).catch(err=>{
          console.log(err, "error message")
      })
  })
 
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})