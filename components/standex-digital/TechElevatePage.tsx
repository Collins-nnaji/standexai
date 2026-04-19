"use client";

import { useEffect } from 'react'

const TechElevatePage = () => {
  useEffect(() => {
    window.location.replace('https://techelevate.shop')
  }, [])
  return (
    <div className='min-h-screen flex items-center justify-center bg-black text-white pt-32'>
      <div className='text-center px-6'>
        <p className='text-sm uppercase tracking-widest text-zinc-500 mb-2'>Redirecting</p>
        <h1 className='text-2xl font-semibold mb-3'>Tech Elevate</h1>
        <p className='text-zinc-400'>Taking you to techelevate.shop… If you are not redirected, <a className='text-[#7C5CFC] underline' href='https://techelevate.shop'>click here</a>.</p>
      </div>
    </div>
  )
}

export default TechElevatePage


