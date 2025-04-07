import React from 'react'

export default function loading() {
  return (
    <div>
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-white dark:border-white"></div>
      </div>
    </div>
  )
}

