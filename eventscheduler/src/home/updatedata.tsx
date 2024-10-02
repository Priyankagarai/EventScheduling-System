import React, { useState } from 'react';
import axios from 'axios'

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface WeeklySchedule {
  [day: string]: TimeSlot[];
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Updatedata: React.FC = () => {
 
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: []
  });

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

 
  const addTimeSlot = (day: string) => {
    if (schedule && schedule[day]) {
      setSchedule(prevSchedule => ({
        ...prevSchedule,
        [day]: [...prevSchedule[day], { startTime: '', endTime: '' }]
      }));
    } else {
      console.error('Day is not valid or schedule is undefined');
    }
  };

  
  const removeTimeSlot = (day: string, index: number) => {
    if (schedule && schedule[day]) {
      setSchedule(prevSchedule => ({
        ...prevSchedule,
        [day]: prevSchedule[day].filter((_, i) => i !== index)
      }));
    } else {
      console.error('Day is not valid or schedule is undefined');
    }
  };

  const updateTimeSlot = (day: string, index: number, type: keyof TimeSlot, value: string) => {
    if (schedule && schedule[day] && schedule[day][index]) {
      setSchedule(prevSchedule => ({
        ...prevSchedule,
        [day]: prevSchedule[day].map((slot, i) => i === index ? { ...slot, [type]: value } : slot)
      }));
    } else {
      console.error('Invalid day or index');
    }
  };

  const validateTime = (startTime: string, endTime: string): boolean => {
    if (!startTime || !endTime) return true; 
    return new Date(`1970-01-01T${endTime}`) > new Date(`1970-01-01T${startTime}`);
  };

  // Function to save the schedule
  const saveSchedule = async () => {
    const userId = localStorage.getItem('userId');
    console.log("Saving schedule...");

    try {
      const response = await axios.post('http://localhost:3001/Updatedata', {
        userId: userId, 
        schedule: schedule 
      });

      if (response.status === 200 || response.status === 201) {
        alert('Schedule saved successfully!');
      } else {
        alert('Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('An error occurred while saving the schedule.');
    }
  };


  const renderDaySlots = (day: string) => (
    <div key={day}>
      <br></br><h3 className='font-bold text-lg'>Free Times for {day}</h3>
      {schedule[day]?.map((timeSlot, index) => (
        <div key={index} className="time-slot font-bold">
          <label>Start Time: 
            <input 
              type="time" 
              value={timeSlot.startTime}
              onChange={(e) => updateTimeSlot(day, index, 'startTime', e.target.value)}
            />
          </label>
          <label>End Time: 
            <input 
              type="time" 
              value={timeSlot.endTime}
              onChange={(e) => updateTimeSlot(day, index, 'endTime', e.target.value)}
            />
          </label>
          {!validateTime(timeSlot.startTime, timeSlot.endTime) && (
            <span className="error">End time must be later than start time</span>
          )}
          <button className=' ml-3 h-7 w-20 bg-gray-900 text-white font-semibold rounded-lg hover:border-2 hover:border-slate-900 hover:bg-slate-200 hover:text-black hover:font-bold' onClick={() => removeTimeSlot(day, index)}>Remove</button>
        </div>
      ))}
      <button className=' mt-3 h-7 w-12 bg-gray-900 text-white font-semibold rounded-lg hover:border-2 hover:border-slate-900 hover:bg-slate-200 hover:text-black hover:font-bold' onClick={() => addTimeSlot(day)}>Add</button>
    </div>
  );

  return (

    <div className="h-24 ">
           <nav className="bg-gray-800 h-16">
            </nav>
<div className='flex items-center justify-center mt-6'>
    <div className="day-picker-container min-h-full w-fit bg-slate-100 shadow p-5">
      <h2 className='text-2xl font-bold text-center'>Select a Day to Set Free Times</h2><br></br>
      
      {/* Day Picker Buttons */}
      <div className="day-picker flex space-x-4 ">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            className={`day-button ${selectedDay === day ? 'selected' : ''} h-9 w-24 bg-slate-600 text-white font-semibold rounded hover:border-2 hover:border-slate-900 hover:bg-slate-200 hover:text-black hover:font-bold`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Show the selected day's time slots */}
      {selectedDay && (
        <div>
          {renderDaySlots(selectedDay)}
        </div>
      )}
    <div className='flex items-center justify-center'>
      <button className ="h-10 w-24 bg-gray-800 text-white font-semibold rounded mt-8 hover:border-double hover:border-4 hover:border-white "onClick={saveSchedule}>Save</button>
    </div>
    </div>
    </div>
    </div>
  );
};

export default Updatedata;
