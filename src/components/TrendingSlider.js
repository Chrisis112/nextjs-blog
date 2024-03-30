"use client";
import React from "react";
import "./TrendingSlider.css";
import Image from "next/image";

const TrendingSlider = () => {
  
  return (
    <> <div className=" mx-auto">
    <div className="wrapper ">
    <div className="track ">   
      <span><Image className="track max-h-auto max-h-25 block mx-auto" alt="image" width={500} height={300} style={{minWidth: "500px"
        }}   src="https://i.imgur.com/7lpoEiL.png"></Image></span>
      <span><Image className="track max-h-auto max-h-25 block mx-auto" width={500} height={300} alt="image" style={{
        paddingLeft: "20px",
        minWidth: "550px"  }} 
        src="https://i.imgur.com/sCvoOA4.png"></Image></span>
      <span><Image className="track max-h-auto max-h-25 block mx-auto" width={500} height={300} alt="image" style={{
        minWidth: "500px"}}  id= "backBtn"src="https://i.imgur.com/j58q4JM.png"></Image></span>
    </div>
              </div>
              </div>
    </>
);

};
export default TrendingSlider;