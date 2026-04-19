"use client";


import HomeAbout from './Home/HomeAbout'
import HomeHero from './Home/HomeHero'
import HomeServices from './Home/HomeServices'
import Standex DigitalSection from './Home/Standex DigitalSection'

import TechSolutions from './Home/TechSolutions'
import Testimonials from './Testimonials'
import WhyChooseUs from './Home/WhyChooseUs'

const Home = () => {
  return (
    <div className='overflow-x-hidden min-h-screen flex flex-col'>
      
      <HomeHero />
      <HomeAbout />
      <HomeServices />
      <Standex DigitalSection />
      <TechSolutions />
      <WhyChooseUs />
      <Testimonials />
      
    </div>
  )
}

export default Home