import React from 'react'
import Logo from './Logo'

const Nav = () => {
  return (
    
    <nav className='w-full h-full z-10 top-0 bg-background px-4.5 pb-4 pt-3 sticky'>
        <div className='flex h-15 rounded-[80px] items-center bg-white justify-center'>
            <div className='flex items-center justify-center gap-2'>
                <Logo />
            </div>
        </div>
    </nav>
  )
}

export default Nav