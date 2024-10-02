const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the time slot schema
const timeSlotSchema = new Schema({
  startTime: { type: String },
  endTime: { type: String }
});

// Define the weekly schedule schema
const WeeklyScheduleSchema = new Schema({
  Sunday: [timeSlotSchema],
  Monday: [timeSlotSchema],
  Tuesday: [timeSlotSchema],
  Wednesday: [timeSlotSchema],
  Thursday: [timeSlotSchema],
  Friday: [timeSlotSchema],
  Saturday: [timeSlotSchema]
});

const MeetingTimeSchema = new Schema({
  date: String,  
  startTime: String, 
  endTime: String    
});
// Define the user schema
const ScheduleUserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  timeSlots: { type: WeeklyScheduleSchema, default: {} },
  meetingtime:{type: MeetingTimeSchema, default:{}}
});

// Create and export the model
const ScheduleModel = mongoose.model('users', ScheduleUserSchema);
module.exports = ScheduleModel;
