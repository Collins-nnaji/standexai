"use client";



import TrainingCareer from './Training/TrainingCareer'
import TrainingConnect from './Training/TrainingConnect'
import TrainingCourses from './Training/TrainingCourses'
import TrainingHeader from './Training/TrainingHeader'
import WhyChooseTraining from './Training/WhyChooseTraining'


const Training = () => {
  return (
    <div className='overflow-x-hidden min-h-screen flex flex-col'>
      
      <TrainingHeader />
      <WhyChooseTraining/>
      <TrainingCareer/>
      <TrainingCourses />
      <TrainingConnect/>
      
    </div>
  )
}

export default Training