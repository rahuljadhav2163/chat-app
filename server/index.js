import dotenv from 'dotenv';
import express from 'express';
import md5 from 'md5';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
dotenv.config();
import path from 'path';
const __dirname = path.resolve();
import Message from './models/Message.js';
import User from './models/User.js';

const app = express();
app.use(express.json());

const io = new Server(5002, {
  cors: {
    origin: 'https://chat-app-tqlj.onrender.com',
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', async (data) => {
    console.log(data);
    io.emit('message', data);
    const { sender, receiver, message } = data;
    const newMessage = new Message({
      sender,
      receiver,
      message,
    });

    await newMessage.save();
  })
});

app.get('/sendMessage', (req, res) => {
  const { message } = req.query;
  io.emit('receive', message);

  res.status(200).json({ message: 'Message sent' });
});

app.get('/api/health', (req, res) => {
 

  res.status(200).json({ message: 'all good' });
});


const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected`);
};
connectDB();

app.post('/api/signup', async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    const user = await User({
      email,
      password,
      fullName
    });
    const savedUser = await user.save();

    res.status(201).json({ data: savedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ data: user, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/users', async (req, res) => {
  const users = await User.find({}).select('_id fullName email');
  res.status(200).json({ data: users });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

  app.get('*', (req, res) => { res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html')) });
}

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
