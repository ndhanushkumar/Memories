import React, { useEffect, useState } from "react";

import "./Memories.css";
import { Button, TextField } from "@mui/material";
import Memory from "./Memory";
import axios from "./axios";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { auth, storage } from "./firebase";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { useStateValue } from "./StateProvider";


function Memories() {
  const[{memories,edit,isEdit},dispatch]=useStateValue();
const[creator,setCreator]=useState("");
const[title,setTitle]=useState("");
const[message,setMessage]=useState("");
const[tags,setTags]=useState("");
const[file,setFile]=useState("");
// const[memories,setMemories]=useState([]);
const[refresh,setRefresh]=useState(false);

useEffect(()=>{
    signInWithEmailAndPassword(auth,"dhanushkumar7575@gmail.com","Jhansi2579@").then((authUser)=>console.log(authUser))
   const getMemory=async()=>{    
       await axios.get("/memories").then((data)=>{
        // setMemories(data.data);
        console.log(data.data);
        dispatch({
          type:"ADD_TO_MEMORY",
          item:data.data,
        });

    }).then(()=>{ console.log(memories);})
}
getMemory();
   
},[refresh])
useEffect(()=>{

if(isEdit){
setCreator(edit.creator);
setTitle(edit.title);
setMessage(edit.message);
setTags(edit.tags);
}


},[isEdit])


const handleSumbit=async (e)=>{
    e.preventDefault();
   
    const uploadTask = ref(storage, `images/${file.name}`);

    await uploadBytes(uploadTask, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    }).then(async ()=>{
    await getDownloadURL(ref(storage, `images/${file.name}`)).then((imageurl)=>{
        console.log(message);
    axios.post("/new",{
        creator:creator,
        title:title,
        message:message,
        tags:tags,
        image:imageurl,
        like:0,
}).then(()=>{console.log("saved")})
  })

 })
  setRefresh(true);
    //  dispatch({
    //    type:"CLEAR_FORM",
    //    clear:{
    //     id:"",
    //     creator:"",
    //     title:"",
    //     message:"",
    //     tags:"",
    // },
    //  })
    setCreator("");
    setMessage("");
    setTags("");
    setTitle("");
    setRefresh(false);
 
}
const handleUpdate=async(e)=>{
e.preventDefault();
const uploadTask = ref(storage, `images/${file.name}`);

    await uploadBytes(uploadTask, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    }).then(async ()=>{
    await getDownloadURL(ref(storage, `images/${file.name}`)).then((imageurl)=>{
        axios.post("/update",{
          id:edit.id,
          creator:creator,
          title:title,
          message:message,
          tags:tags,
          image:imageurl,
  }).then(()=>{console.log("updated")})
    })

  


})
dispatch({
  type:"CLEAR_FORM",
  clear:{
    id:"",
    creator:"",
    title:"",
    message:"",
    tags:"",
},
})
setRefresh(true);
setCreator("");
setMessage("");
setTags("");
setTitle("");
setRefresh(false)
;
}

  return (
    <div className="home">
      <div className="memories">
      {memories.map((memory)=>(
               <Memory key={memory._id} id={memory._id} creator={memory.creator} title={memory.title} message={memory.message} tags={memory.tags} BG={memory.image} like={memory.like} />
      ))}
     
      
      </div>
     <div className="newMemories">
        <form className="memories_form">
          <h2>Creating a Memory</h2>
          <TextField
          required
            id="outlined-basic"
            label="Creator"
            variant="outlined"
            className="input"
            value={creator}
            onChange={(e)=>{setCreator(e.target.value);}}
          />
          <TextField
          required
            id="outlined-basic"
            label="Title"
            variant="outlined"
            className="input"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />
          <TextField
          required
            id="outlined-multiline-static"
            label="Message"
            multiline
            rows={4}
            className="input"
            value={message}
            onChange={(e)=>setMessage(e.target.value)
            }
          />

          <TextField
          required
            id="outlined-basic"
            className="input"
            label="Tags(comma seperated)"
            variant="outlined"
            value={tags}
            onChange={(e)=>setTags(e.target.value)}
          />
          <input required type="file" onChange={(e)=>{if (e.target.files[0]) {
      setFile(e.target.files[0]);
    
    }}}/>{!isEdit?  <Button type="submit" variant="contained" onClick={handleSumbit}>Submit</Button>:  <Button type="submit" variant="contained" onClick={handleUpdate}>Update</Button>}
          <Button variant="contained" className="clear_button" onClick={()=>{
               dispatch({
                type:"CLEAR_FORM",
                clear:{
                  id:"",
                  creator:"",
                  title:"",
                  message:"",
                  tags:"",
              },
              })
              setCreator("");
              setMessage("");
              setTags("");
              setTitle("");
          }}>
            Clear
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Memories;
