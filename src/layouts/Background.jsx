import React from 'react'

function Background() {
  return (
    <><div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)] dark:hidden"></div>
        
        <div className="absolute bottom-0 left-[-20%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(34,197,94,0.15),rgba(255,255,255,0))] dark:block hidden"></div>
        <div className="absolute bottom-0 right-[-20%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(34,197,94,0.15),rgba(255,255,255,0))] dark:block hidden"></div>
        </>
  )
}

export default Background