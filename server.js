// Importing required modules
const express = require('express'); // Express is used to create a web server
const mongoose = require('mongoose'); // Used to connect with MongoDB

const app = express();

// MongoDB URI from environment variable or default to local MongoDB
const MongoDBURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel';

// Connect to the MongoDB database
mongoose.connect(MongoDBURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the schema for the Reservation model
const reservationSchema = new mongoose.Schema({
  StudentName: String,
  FatherName: String,
  email: String,
  phoneNumber: String,
  Branch: String,
  Year: String,
  MeritScore: Number,
  Category: String,
  Appstatus: String,
});

// Create the Reservation model based on the defined schema
const Reservation = mongoose.model('Reservation', reservationSchema);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to render the index page
app.get('/', (req, res) => {
  res.render('index');
});

// Route to handle form submissions and save reservations
app.post('/reserve', async (req, res) => {
  try {
    const {
      StudentName,
      FatherName,
      email,
      phoneNumber,
      Branch,
      Year,
      MeritScore,
      Category,
    } = req.body;

    // Create a new reservation
    const reservation = new Reservation({
      StudentName,
      FatherName,
      email,
      phoneNumber,
      Branch,
      Year,
      MeritScore,
      Category,
    });

    // Set the application status based on MeritScore
    reservation.Appstatus = MeritScore > 80 ? 'Seat Allocated' : 'Seat Not Allocated';

    // Save the reservation to the database
    await reservation.save();

    console.log('Reservation saved:', reservation);
    
    // Render the result page with reservation data
    res.render('result', { reservation });
  } catch (error) {
    console.error('Error processing reservation:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
