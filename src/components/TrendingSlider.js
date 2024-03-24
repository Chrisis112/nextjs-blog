"use client";
import React from "react";
import "./TrendingSlider.css";

const TrendingSlider = () => {
  
  return (
    <>
    <div className="firstContainer">
       <span><img className="firstImage" src="https://i.imgur.com/DL8lA2O.png"></img></span>
       </div>
    <div className="wrapper">
    <div className="track">   
      <span><img style={{minWidth: "500px"
        }}   src="https://i.imgur.com/7lpoEiL.png"></img></span>
      <span><img style={{
        paddingLeft: "20px",
        minWidth: "500px"  }} 
        src="https://i.imgur.com/sCvoOA4.png"></img></span>
      <span><img style={{
        minWidth: "500px"}}  id= "backBtn"src="https://i.imgur.com/j58q4JM.png"></img></span>
    </div>
              </div>
    </>
);

};
export default TrendingSlider;