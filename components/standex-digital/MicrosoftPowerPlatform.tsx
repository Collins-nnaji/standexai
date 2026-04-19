"use client";

import Benefits from './MicrosoftPowerPlatform/Benefits'

import KeyFeatures from './MicrosoftPowerPlatform/KeyFeatures'

import PowerPlatformSections from './MicrosoftPowerPlatform/PowerPlatformSections'
import TableOfContents from './MicrosoftPowerPlatform/TableOfContents'
import WhatIsMpp from './MicrosoftPowerPlatform/WhatIsMpp'


const MicrosoftPowerPlatform = () => {
  return (
    <div className='overflow-x-hidden min-h-screen flex flex-col'>
      
      <WhatIsMpp />
      <TableOfContents />
      <PowerPlatformSections />
      <KeyFeatures />
      <Benefits />
      
    </div>
  )
}

export default MicrosoftPowerPlatform