import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getClientTasks,
  completeTask,
  rateTask,
  fundTask,
  submitComplaint
} from "../api/api";

import StarRating from "../components/StarRating";
import Pagination from "../components/Pagination";
import ChatPanel from "../components/ChatPanel";

export default function ClientDashboard() {

  const [tasks, setTasks] = useState([]);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(()=>{
    loadTasks();
  },[page,limit]);


  const loadTasks = async ()=>{

    try{

      const data = await getClientTasks(page,limit);

      if(data?.data){

        setTasks(data.data);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);

      }else{

        setTasks([]);

      }

    }catch(err){

      console.error("Failed to load tasks");

    }finally{

      setLoading(false);

    }

  };


/* COMPLETE TASK */

const handleComplete = async(taskId)=>{

if(!window.confirm("Mark this task as completed?")) return;

try{

const res = await completeTask(taskId);

if(res?.message)
loadTasks();

}catch(err){

console.error("Complete failed");

}

};


/* FUND TASK */

const handleFund = async(id)=>{

const res = await fundTask(id);

alert(res.message);

loadTasks();

};


/* SUBMIT RATING */

const handleRatingSubmit = async(taskId)=>{

const rating = ratings[taskId];
const review = reviews[taskId] || "";

if(!rating){

alert("Please select rating");
return;

}

try{

const res = await rateTask(taskId,rating,review);

if(res?.message){

alert("Rating submitted successfully!");
loadTasks();

}

}catch(err){

console.error("Rating failed");

}

};


/* REPORT VOLUNTEER */

const handleComplaint = async(taskId)=>{

const message = prompt("Describe the issue with the volunteer:");

if(!message) return;

const res = await submitComplaint(taskId,message);

alert(res.message || "Complaint submitted");

};



if(loading)
return <p className="loading-text">Loading tasks...</p>;



return(

<div className="dashboard-container-modern">


{/* HEADER */}

<div className="dashboard-header-row">

<h2 className="dashboard-title-modern">
📋 Client Dashboard
</h2>

<Link
to="/post-task"
className="post-task-link-btn"
>
➕ Post New Task
</Link>

</div>



{tasks.length===0?

<p className="empty-text-modern">
No tasks yet
</p>

:

<>

<div className="task-grid-modern">


{tasks.map(task=>(

<div
key={task._id}
className="task-card-premium"
>


{/* HEADER */}

<div className="task-header-modern">

<h3>{task.title}</h3>

<span
className={`status-badge-modern status-${task.status}`}
>
{task.status}
</span>

</div>


<p className="task-desc-modern">
{task.description}
</p>



{/* VOLUNTEER INFO */}

{task.volunteer && (

<div className="volunteer-info-box">

<div>
👤 <strong>{task.volunteer.name}</strong>
</div>

<div className="rating-badge">

⭐ {task.volunteer.averageRating?.toFixed(1) || "0.0"}

<span className="rating-count">
({task.volunteer.totalRatings || 0})
</span>

</div>

</div>

)}



{/* CHAT BUTTON */}

{task.volunteer && (

<button
className="btn-primary modern-btn"
style={{marginTop:"10px"}}
onClick={()=>setActiveChat(task._id)}
>

💬 Chat with Volunteer

</button>

)}



{/* FUND BUTTON */}

{task.paymentStatus==="pending" && (

<button
className="btn-primary modern-btn"
onClick={()=>handleFund(task._id)}
>

💰 Fund Task

</button>

)}



{/* COMPLETE BUTTON */}

{task.status==="submitted" && (

<button
className="btn-primary modern-btn"
onClick={()=>handleComplete(task._id)}
>

✅ Mark as Complete

</button>

)}



{/* REPORT BUTTON */}

{task.volunteer && (

<button
className="btn warning-btn"
style={{marginTop:"8px"}}
onClick={()=>handleComplaint(task._id)}
>

⚠ Report Volunteer

</button>

)}



{/* RATING */}

{task.status==="completed" && !task.rating && (

<div className="rating-box-modern">

<h4>⭐ Rate Volunteer</h4>

<StarRating
value={ratings[task._id] || 0}
onChange={(val)=>setRatings(prev=>({

...prev,
[task._id]:val

}))}
/>

<textarea
placeholder="Write review (optional)"
value={reviews[task._id] || ""}
onChange={(e)=>setReviews(prev=>({

...prev,
[task._id]:e.target.value

}))}
className="review-textarea-modern"
/>

<button
className="btn-primary modern-btn"
onClick={()=>handleRatingSubmit(task._id)}
>

Submit Rating

</button>

</div>

)}



{/* ALREADY RATED */}

{task.rating && (

<div className="already-rated-box-modern">

⭐ You rated this volunteer {task.rating}/5

</div>

)}



</div>

))}


</div>



{/* PAGINATION */}

<Pagination

page={page}
totalPages={totalPages}
total={total}
limit={limit}
setPage={setPage}
setLimit={setLimit}

/>

</>

}



{/* CHAT PANEL */}

{activeChat && (

<ChatPanel
taskId={activeChat}
onClose={()=>setActiveChat(null)}
/>

)}



</div>

);

}