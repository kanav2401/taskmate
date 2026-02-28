import { useEffect, useState } from "react";
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

<h1 className="admin-title">
⚠ Complaints Panel
</h1>


<table className="admin-table">

<thead>

<tr>

<th>Complainant</th>
<th>Against</th>
<th>Task</th>
<th>Complaint</th>
<th>Date</th>
<th>Action</th>

</tr>

</thead>


<tbody>

{complaints.map(c=>(

<tr key={c._id}>


{/* COMPLAINANT */}

<td>

<b>{c.complainBy?.name || "-"}</b>

<br/>

<span className="badge badge-pending">

{c.complainBy?.role}

</span>

</td>



{/* AGAINST */}

<td>

<b>{c.complainAgainst?.name || "-"}</b>

<br/>

<span className="badge badge-overdue">

{c.complainAgainst?.role}

</span>

</td>



{/* TASK */}

<td>

{c.task?.title || "-"}

</td>



{/* MESSAGE */}

<td>

{c.message}

</td>



{/* DATE */}

<td>

{new Date(c.createdAt).toDateString()}

</td>



{/* ACTION */}

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