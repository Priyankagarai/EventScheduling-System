import axios from 'axios'
import { Link } from 'react-router-dom'
import { useState, useEffect} from 'react';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface WeeklySchedule {
  [day: string]: TimeSlot[];
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Adddata: React.FC = () => {
      const [userData, setUserData] = useState(null);
      const [schedule, setSchedule] = useState<WeeklySchedule>({
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: []
      });


        // State to track editing slot (day and index)
         const [editingSlot, setEditingSlot] = useState<{ day: string, index: number } | null>(null);
         const [editedSlot, setEditedSlot] = useState<TimeSlot>({ startTime: '', endTime: '' });


    useEffect(() => {
        // Retrieve the userId from localStorage
        const userId = localStorage.getItem('userId');

        if (userId) {
            // Fetch user data from backend using the stored userId
            const fetchUserData = async () => {
                try {
                    const response = await axios.post('http://localhost:3001/Adddata', { _id: userId });
                    if (response.data.success && response.data.schedule) {
                        setSchedule(response.data.schedule);
                        setUserData(response.data);// Store the user data in state
                      
                        
                        
                      } else {
                        console.log('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUserData();
        } else {
            console.log('No user ID found in localStorage');
        }
    }, []);
  
    const deleteTimeSlot = async (day: string, index: number) => {
      const userId = localStorage.getItem('userId'); // Assuming the userId is stored here
      const slotToDelete = schedule[day][index]; // Get the time slot to delete
    
      try {
        // Send a delete request to the backend
        const response = await axios.post('http://localhost:3001/deleteslot', {
          userId,
          day,
          startTime: slotToDelete.startTime,
          endTime: slotToDelete.endTime
        });
    
        if (response.data.success) {
          // Update the state only if the deletion was successful
          const updatedDaySchedule = [...schedule[day]];
          updatedDaySchedule.splice(index, 1);
    
          setSchedule({
            ...schedule,
            [day]: updatedDaySchedule,
          });
        } else {
          console.log('Failed to delete time slot from the database');
        }
      } catch (error) {
        console.error('Error deleting time slot:', error);
      }
    };

    const handleEditClick = (day: string, index: number) => {
      setEditingSlot({ day, index });
      const slot = schedule[day][index];
      setEditedSlot({ startTime: slot.startTime, endTime: slot.endTime });
    };
  
    const handleEditChange = (field: keyof TimeSlot, value: string) => {
      setEditedSlot((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  
    const saveEditedSlot = async () => {
      if (!editingSlot) return;
      const { day, index } = editingSlot;
      const userId = localStorage.getItem('userId');

      try {
        const response = await axios.post('http://localhost:3001/editslot', {
          userId,
          day,
          oldStartTime: schedule[day][index].startTime,
          oldEndTime: schedule[day][index].endTime,
          newStartTime: editedSlot.startTime,
          newEndTime: editedSlot.endTime,
        });
  
        if (response.data.success) {
          const updatedDaySchedule = [...schedule[day]];
          updatedDaySchedule[index] = { ...editedSlot };
          alert('time updated');
          setSchedule({
            ...schedule,
            [day]: updatedDaySchedule,
          });
          
          setEditingSlot(null); // Exit edit mode after successful save
        } else {
          console.log('Failed to update time slot');
        }
      } catch (error) {
        console.error('Error updating time slot:', error);
      }
    };
    
    
    const renderTimeSlots = (timeSlots: TimeSlot[], day:string) => {
      if (timeSlots.length === 0) {
        return <span>No available slots</span>;
      }

      return timeSlots.map((slot, index) => {
        if (editingSlot && editingSlot.day === day && editingSlot.index === index) {
          return (
            <div className='font-bold' key={index}>
              <input
                type="time"
                value={editedSlot.startTime}
                onChange={(e) => handleEditChange('startTime', e.target.value)}
                placeholder="Start Time"
              />
              |
              |           <input
                type="time"
                value={editedSlot.endTime}
                onChange={(e) => handleEditChange('endTime', e.target.value)}
                placeholder="End Time"
              />
              <button className="bg-slate-200 w-12 h-6 m-2 text-sm rounded-md border-2 hover:bg-slate-400 hover:font-medium" onClick={saveEditedSlot}>Save</button>
              <button className="bg-slate-200 w-12 h-6 m-2 text-sm rounded-md border-2 hover:bg-slate-400 hover:font-medium" onClick={() => setEditingSlot(null)}>Cancel</button>
            </div>
          );
        }
      return  (
        <div className='font-bold' key={index}>
          {slot.startTime} - {slot.endTime} 
          <button className="bg-slate-200 w-10 h-6 m-3 text-sm rounded-md border-2 text-blue-700 hover:border-blue-500 hover:bg-slate-400 hover:font-medium hover:text-white" onClick={() => handleEditClick(day, index)}>Edit</button>
        <button className="bg-slate-200 w-10 h-6 mr-2 text-sm rounded-md border-2 text-red-700 hover:border-red-500 hover:bg-slate-400 hover:font-medium hover:text-white" onClick={()=> deleteTimeSlot(day, index)}>Del</button>
        </div>
      )
    });
    };
    return (
        
           <div className="min-h-max ">
           <nav className="bg-gray-800">
             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
               <div className="flex h-16 items-center justify-between">
                 <div className="flex items-center">
                   <div className="hidden md:block">
                     <div className="ml-10 flex items-center space-x-4">
                       <a href="#" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">
                        Schedule
                       </a>
                       <Link to="/Updatedata" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                         New slot
                       </Link>
                      
                        </div>
                   </div>
                 </div>
     
                
               </div>
             </div>
     
            
           </nav>
     
           <header className="bg-white shadow">
             <div className="flex items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
               <h1 className="w-1/2 text-3xl font-bold tracking-tight text-gray-900 pl-10"> {userData ? userData.name : 'Loading...'}</h1>
               <ul className='w-1/2'>
                        <li className='pl-80'><span className='text-xl font-bold text-gray-700'>Scheduled day::</span>    {userData ? userData.meetingtime.date: 'Loading...'}</li>
                        <li className='pl-80'><span className='text-xl font-bold text-gray-700'>StartTime::</span>    {userData ? userData.meetingtime.startTime : 'Loading...'}</li>
                        <li className='pl-80'><span className='text-xl font-bold text-gray-700'>Endtime::</span>    {userData ? userData.meetingtime.endTime : 'Loading...'}</li>
                </ul>
             </div>
           </header>
     
           <main>
             <div className="flex items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
               {/* Main content goes here */}
               <div>
      <h2 className='text-lg pl-10'><b>Weekly Schedule</b></h2>
      <br></br>
      <table className="table-auto border-separate border-gray-400 pl-10">
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
                {renderTimeSlots(schedule[day], day)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
             </div>
           </main>
         </div>
        
        
      )
}

export default Adddata
