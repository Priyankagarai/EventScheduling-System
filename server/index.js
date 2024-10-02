const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const ScheduleModel = require('./models/schedular'); 

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/schedular')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));



  app.post('/Signup', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      
     
      const users = new ScheduleModel({ email, password, name });
      
      await users.save();
      res.json({ success: true, name: users.name, _id: users._id });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).send('Error creating user');
    }
  });




  app.post('/Adddata', async (req, res) => {
    try {
        const { _id , schedule} = req.body;
        const user = await ScheduleModel.findById(_id).exec();
        
        
        if (user) {
            res.json({ success: true, name: user.name, _id: user._id, schedule:user.timeSlots, meetingtime:user.meetingtime });
        
        
        
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
 
    
});

app.post('/editslot', async (req, res) => {
  try {
    const { userId, day, oldStartTime, oldEndTime, newStartTime, newEndTime } = req.body;

    const user = await ScheduleModel.findById(userId).exec();
    if (!user) {
      return res.status(404).send('User not found.');
    }

    const slotIndex = user.timeSlots[day].findIndex(
      (slot) =>
        slot.startTime === oldStartTime && slot.endTime === oldEndTime
    );

    if (slotIndex === -1) {
      return res.status(404).send('Time slot not found.');
    }


    user.timeSlots[day][slotIndex].startTime = newStartTime;
    user.timeSlots[day][slotIndex].endTime = newEndTime;

 
    await user.save();
    res.status(200).send('Time slot updated successfully.');
  } catch (error) {
    console.error('Error updating time slot:', error);
    res.status(500).send('Error updating time slot.');
  }
});

app.post('/deleteslot', async (req, res) => {
  const { userId, day, startTime, endTime } = req.body;

  try {
   
    const user = await ScheduleModel.findById(userId).exec();

   
    if (!user) {
      return res.status(404).send('User not found.');
    }

 
    if (!user.timeSlots[day]) {
      return res.status(400).send('Day not found in the schedule.');
    }

  
    user.timeSlots[day] = user.timeSlots[day].filter(slot => {
      return !(slot.startTime === startTime && slot.endTime === endTime);
    });

    
    await user.save();
    res.json({ success: true});    
  } catch (error) {
    console.error('Error deleting time slot:', error);
    res.status(500).send('Error deleting time slot.');
  }
});



app.post('/Updatedata', async (req, res) => {
  const { userId, schedule } = req.body;

  try {
  
    const user = await ScheduleModel.findById(userId).exec();

  
    if (!user) {
      return res.status(404).send('User not found.');
    }

  
    Object.keys(schedule).forEach(day => {
      if (schedule.hasOwnProperty(day)) {
        user.timeSlots[day] = [...(user.timeSlots[day] || []), ...schedule[day]];
      }
    });

 
    await user.save();
    res.status(200).send('Time slots updated successfully.');
  } catch (error) {
    console.error('Error updating time slots:', error);
    res.status(500).send('Error updating time slots.');
  }
});



app.post("/Login", async (req, res) => {
    const { email, password } = req.body;
    console.log('Request body:', req.body);
    console.log('Received email:', email); 
    console.log('Received password:', password); 


    try {
        const users = await ScheduleModel.findOne({ email: email }).exec();

        if (users) {
            if (users.password === password) {
                res.json({ success: true, name: users.name, _id: users._id });
                console.log("a");
                console.log(users.data);
                
                
            } else {
                res.json('Password is incorrect');
                console.log("b");
            }
        } else {
            res.json('No record existed');
            console.log("c");
        }
    } catch (error) {
        res.status(500).json('An error occurred');
    }
});



app.get('/Admin', async (req, res) => {
  try {
    const users = await ScheduleModel.find();  
    res.json({ users }); 
    console.log(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/bookTime', async (req, res) => {
  const { userId, day, startTime, endTime } = req.body;

  try {

    const user = await ScheduleModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    user.meetingtime = {date: day, startTime, endTime };
    
    

 
    await user.save();

    return res.json({ message: 'Meeting time successfully booked' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
