"use client";

import AboutProcess from './About/AboutProcess'
import AboutUsHeader from './About/AboutUsHeader'
import AboutWhyChooseUs from './About/AboutWhyChooseUs'




const About = () => {
  return (
    <div className='overflow-x-hidden min-h-screen flex flex-col'>
      
      <AboutUsHeader/>
      <AboutWhyChooseUs/>
      <AboutProcess/>
      
    </div>
  )
}

export default About