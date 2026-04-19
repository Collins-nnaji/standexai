"use client";



import PowerBiHeader from './PowerBi/PowerBiHeader'
import WhatIsPowerBi from './PowerBi/WhatIsPowerBi'
import PowerBiServices from './PowerBi/PowerBiServices'
import PowerBiHelp from './PowerBi/PowerBiHelp'
import PowerBiAbility from './PowerBi/PowerBiAbility'


const PowerBi = () => {
  return (
    <div className='overflow-x-hidden min-h-screen flex flex-col'>
      
      <PowerBiHeader />
      <WhatIsPowerBi/>
      <PowerBiServices/>
      <PowerBiHelp />
      <PowerBiAbility />
      
    </div>
  )
}

export default PowerBi