import Link from 'next/link';
import React from 'react'
import { TbExternalLink } from 'react-icons/tb';

const LinkButton = ({link}:{link:string}) => {
  return (
    <Link
      href={link}
      className="h-8 w-8 rounded-full bg-blue-100 hover:bg-blue-200 duration-200 flex justify-center items-start p-2"
    >
      <TbExternalLink className="text-gray-500" />
    </Link>
  );
}

export default LinkButton