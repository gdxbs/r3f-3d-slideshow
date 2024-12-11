"use client";
import React from 'react';
import '../styles.css';

interface CardProps {
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  linkText: string
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, linkUrl, linkText }) => {
  return (
    <div className="flex flex-col max-w-sm rounded overflow-hidden shadow-lg bg-white/90 h-full">
      <img className="w-full flex-shrink-0 object-contain" src={imageUrl} alt={title} />
      <div className="flex-grow px-6 py-4">
        <h2 className="font-prohibition text-xl mb-2 text-[#0e0d0d]">{title}</h2>
        <p className="text-[#0e0d0d] font-brandon text-base mb-4">{description}</p>
        <a
          href={linkUrl}
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-prohibition py-2 px-4 rounded transition duration-300 ease-in-out"
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkText}
        </a>
      </div>
    </div>
  )
}

export default Card;