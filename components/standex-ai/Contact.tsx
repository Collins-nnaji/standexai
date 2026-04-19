"use client";

import ContactHeader from './Contact/ContactHeader'
import ContactLocation from './Contact/ContactLocation'




const Contact = () => {
  return (
    <div className='overflow-x-hidden min-h-screen flex flex-col'>
      
      <ContactHeader />
      <ContactLocation/>
      
    </div>
  )
}

export default Contact