import React, { useState } from 'react';
import "./Memories.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import axios from './axios';
import { useStateValue } from './StateProvider';
import { IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function Memory(props) {
  const[{edit},dispatch]=useStateValue();
  const[liked,setLiked]=useState(false);
  const[likes,setLikes]=useState(props.like);
    const tags=props.tags.split(",");
const editMemory=()=>{
  dispatch({
      type:"EDIT_MEMORY",
      edit:{
        id:props.id,
        creator:props.creator,
        title:props.title,
        message:props.message,
        tags:props.tags,
      }
  });
  console.log(edit);
}
const handlelike=()=>{
  
    axios.post("/update",{
      id:props.id,
      like:props.like+1,
    }).then(()=>console.log("liked"))
    setLiked(true);
    setLikes(likes+1)
  
  
    
}

const handleunlike=()=>{
  axios.post("/update",{
    id:props.id,
    like:props.like-1,
  }).then(()=>console.log("disliked"))
  setLiked(false);
  setLikes(likes-1); 

}

    const deleteMemory=()=>{

   dispatch({
     type:"DELETE_MEMORY",
     _id:props.id,

   })

    axios.post("/delete",{
        _id:props.id,
    }).then((res)=>{
        
                console.log(res.data);
    })
}
  return <div>
       <div className="memories_page">
          <div className="top" style={{backgroundImage:`url("${props.BG}")`}}>
            <div className="header">
              <div className="header_info">
                <h3>{props.creator}</h3>
                <p>2 Months ago</p>
              </div>

              <div className="edit_memory">
                <IconButton><MoreHorizIcon onClick={editMemory}/></IconButton>
                
              </div>
            </div>
          </div>

          <div className="bottom">
<div className="tags"> {tags.map((tag)=>(<p> #{tag}</p>
              ))}</div>
             
    
            
            <h2>{props.title}</h2>
            <p>
             {props.message}
            </p>
            <div className="option">
              <div className="icon"><IconButton> 
                {liked?<ThumbUpIcon  onClick={handleunlike}/>: <ThumbUpOutlinedIcon  onClick={handlelike}/>}
                </IconButton>
               <p> Like {likes}</p>
              </div>
              <div className="icon" onClick={deleteMemory}>
                Delete <IconButton><DeleteOutlineOutlinedIcon /></IconButton>
              </div>
            </div>
          </div>
        </div>
  </div>;
}

export default Memory;
 