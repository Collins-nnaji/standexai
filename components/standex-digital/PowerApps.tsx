"use client";



import PowerAppsHeader from './PowerApps/PowerAppsHeader'
import WhatIsMPA from './PowerApps/WhatIsMPA'
import PASolutions from './PowerApps/PASolutions'
import PAHowWeCanHelp from './PowerApps/PAHowWeCanHelp'
import PAAbility from './PowerApps/PAAbility'
import PAProcess from './PowerApps/PAProcess'


const PowerApps = () => {
  return (
    <div className='overflow-x-hidden min-h-screen flex flex-col'>
      
      <PowerAppsHeader/>
      <WhatIsMPA />
      <PASolutions/>
      <PAHowWeCanHelp />
      <PAAbility/>
      <PAProcess />
      
    </div>
  )
}

export default PowerApps