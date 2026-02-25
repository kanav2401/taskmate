import {useEffect,useState} from "react";
import {
getComplaints,
deleteComplaint
} from "../api/api";

export default function AdminComplaints(){

const [complaints,setComplaints] = useState([]);


useEffect(()=>{

loadComplaints();

},[]);


const loadComplaints = async()=>{

const data = await getComplaints();

setComplaints(Array.isArray(data)?data:[]);

};


const handleDelete = async(id)=>{

await deleteComplaint(id);

loadComplaints();

};



return(

<div className="admin-container">

<h1>⚠ Complaints Panel</h1>


<table className="admin-table">

<thead>

<tr>

<th>Client</th>
<th>Volunteer</th>
<th>Task</th>
<th>Complaint</th>
<th>Date</th>
<th>Action</th>

</tr>

</thead>


<tbody>

{complaints.map(c=>(

<tr key={c._id}>

<td>

{c.client?.name}

</td>

<td>

{c.volunteer?.name}

</td>

<td>

{c.task?.title}

</td>

<td>

{c.message}

</td>

<td>

{new Date(c.createdAt)
.toDateString()}

</td>

<td>

<button
className="btn-small"
onClick={()=>handleDelete(c._id)}
>

Delete

</button>

</td>

</tr>

))}

</tbody>


</table>


</div>

);

}