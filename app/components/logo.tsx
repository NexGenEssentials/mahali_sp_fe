import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <Link href={"/"}>
    <div className="h-20 w-20 rounded-full  bg-white flex items-center justify-center">
    <Image
      src={"/images/logo.png"}
      alt="mahali africa"
      height={70}
      width={70}
      className="object-cover"
      />
      </div>
  </Link>
  )
}

export default Logo