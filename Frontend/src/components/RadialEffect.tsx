import React from 'react'

function RadialEffect() {
  return (
<div className="relative flex items-center justify-center h-full w-full">
  <div className="absolute rounded-full filter blur-3xl md:w-150 md:h-150 " style={{
    background: 'radial-gradient(#0059a79d, #FFFDE4)',
  }}></div>
  <div className="z-10">
    <p className='text-center text-4xl font-bold'>Local AI</p>
    <p className="mt-4 text-center text-[#1e1e1e] text-xl ">How can I help you today?</p>
  </div>
</div>
  )
}

export default RadialEffect

