import React, { useState } from 'react';

type CustomCardContainerProps = {
  cardItems: string[];
};

function CustomCardContainer({ cardItems }: CustomCardContainerProps) {

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <div className='bg-white rounded-[0.5rem] h-full scrollbar-hide p-2 flex flex-col gap-2'>
      {cardItems.map((item, i) => (
        <p
          key={i}
          onClick={() => setSelectedIndex(i)} 
          className={`hover:bg-gray-200 text-[1rem] rounded-[0.25rem] px-2 font-medium leading-8 line-clamp-1 cursor-pointer ${
            selectedIndex === i ? 'bg-gray-200' : 'bg-transparent'
          }`}
        >
          {item}
        </p>
      ))}
    </div>
  );
}

export default CustomCardContainer;