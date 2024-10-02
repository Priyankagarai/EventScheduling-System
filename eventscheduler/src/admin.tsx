import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TimeSlotSchema {
  startTime: string;
  endTime: string;
}

interface WeeklySchedule {
  [day: string]: TimeSlotSchema[];
}

interface MeetingSchedule {
  date: string;  
  startTime: string;
  endTime: string;
}

interface User {
  _id: string;
  email: string;
  name: string;
  timeSlots: WeeklySchedule;
  meetingtime: MeetingSchedule; 
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Admin');
        setUsers(response.data.users);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsersData();
  }, []);

  const handleBookTime = async (userId: string, day: string, startTime: string) => {
    const endTime = calculateEndTime(startTime);

    try {
      await axios.post('http://localhost:3001/bookTime', { userId, day, startTime, endTime });
      alert('Meeting time successfully booked');
      
      const response = await axios.get('http://localhost:3001/Admin');
      setUsers(response.data.users); 
    } catch (err) {
      console.error(err);
      alert('Error booking time');
    }
  };

  const calculateEndTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endMinutes = (minutes + 30) % 60;
    const endHours = hours + Math.floor((minutes + 30) / 60);
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const renderTimeSlots = (user: User, day: string) => {
    const timeSlots = user.timeSlots[day];
    const meetingday= user.meetingtime?.date;
   
    if (!timeSlots || timeSlots.length === 0) {
      return <span>No available slots</span>;
    }

    return timeSlots.map((slot, index) => (
      <div key={index} className="flex items-center space-x-2">
        <span>{slot.startTime} - {slot.endTime}</span>
        {/* Make sure we're comparing the correct fields (e.g., day of the week) */}
        {!user.meetingtime || meetingday !== day || user.meetingtime.startTime !== slot.startTime ? (
          <button
            className="ml-2 bg-white text-blue-500 font-bold font-serif px-2 py-1 rounded"
            onClick={() => handleBookTime(user._id, day, slot.startTime)}
          >
            Book Time
          </button>
        ) : (
          <span className="text-green-600 font-bold font-serif px-2 py-1  ">Booked</span>
        )}
      </div>
    ));
  };

  return (

    <div className="min-h-max ">
           <nav className="bg-gray-800">
             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
               <div className="flex h-16 items-center justify-between">
                 <div className="flex items-center">
                   <div className="hidden md:block">
                     <div className="ml-10 flex items-center space-x-4">
                       <a href="#" className="rounded-md bg-gray-900 px-3 py-2 text-lg font-medium text-white" aria-current="page">
                         Admin
                       </a>
                        </div>
                   </div>
                 </div>    
               </div>
             </div>
     
            
           </nav>
           <header className="bg-white shadow">
             <div className="flex items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
               <h1 className=" text-2xl font-bold tracking-tight text-gray-900 pl-10"> Users Weekly Schedule</h1>
               
             </div>
           </header>


    <div className="min-h-full">
      <nav className="bg-gray-800">
        {/* ...existing navbar code */}
      </nav>

      <header className="bg-white shadow">
        {/* ...existing header code */}
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-20 py-6 sm:px-20 lg:px-20">
          <div>
            {users.map(user => (
              <div key={user._id} className="mb-6">
                <h3 className="text-2xl font-bold">{user.name}</h3><br></br>
                {user.meetingtime && (
                  <div className="mb-4 ">
                    <div className='bg-slate-50 w-96 h-14 border-2 border-green-600 rounded-md text-center text-green-600 font-bold '>
                   Booked Time
                   <br></br> {user.meetingtime.date}  {user.meetingtime.startTime} - {user.meetingtime.endTime}
                  
                  </div>
                  </div>
                )}
                <table className="table-auto border-separate border-gray-400 w-96">
                  <thead>
                    <tr>
                    <th className="border border-gray-400 px-4 py-2 bg-slate-200 text-xl">Day</th>
                    <th className="border border-gray-400 px-4 py-2 bg-slate-200 text-xl">Available Time Slots</th>

                    </tr>
                  </thead>
                  <tbody>
                    {daysOfWeek.map(day => (
                      <tr key={day}>
                        <td className="border border-gray-400 px-4 py-2 text-lg"><b>{day}</b></td>
                        <td className="border border-gray-400 px-4 py-2">
                          {renderTimeSlots(user, day)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
    </div>
  );
};

export default Admin;
