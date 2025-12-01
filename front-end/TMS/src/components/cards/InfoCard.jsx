import React from 'react'

export default function InfoCard({ icon, label, value, color }) {
  return (
    <div>
      <div className={`flex items-center  gap-3`}>
        <div className={`w-2 h-2 md:w-3  md:h-3 ${color} rounded-full`}/>
      
        <div className='flex items-center gap-2'>

          <p className="text-xs md:text-[16px] font-semibold text-gray-500">{label}</p>
          <p className="text-sm  md:text-[16px] font-semibold text-black mt-1">{value}</p>
</div>

        </div>
      </div>  
   
  )
}
