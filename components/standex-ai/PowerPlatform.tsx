"use client";

import PPabout from "./PowerPlatform/PPabout"


import PPservices from "./PowerPlatform/PPservices"
import Testimonials from "./Testimonials"
import PPdiscovery from "./PowerPlatform/PPdiscovery"

const PowerPlatform = () => {
  return (
    <div className='overflow-x-hidden min-h-screen flex flex-col'>
      
      <PPabout />
      <PPservices />
      <PPdiscovery />
      <Testimonials />
      
    </div>
  )
}

export default PowerPlatform