import OneSignal from 'react-onesignal'
import { useEffect } from "react";

useEffect (() => {
    OneSignal.init({
      appId: "bf48c16a-3835-4de8-9e8e-220e4b0ae33b",
    });
  })

const onHandleTag = (tag) => {
  console.log ('tagging')
  OneSignal.sendTag ('tech', tag) 
}
export default onHandleTag