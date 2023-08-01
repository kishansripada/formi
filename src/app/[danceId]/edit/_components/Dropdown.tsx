import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

type Props = {
   options: string[];
   icons: string[];
   actions: Function[];
   value: string;
   icon: string;
   dropDownToggle: boolean;
};

const Dropdown: React.FC<Props> = ({ options, icons, actions, value, icon, dropDownToggle }) => {
   useEffect(() => {
      setIsDropdownOpen(false);
   }, [dropDownToggle]);

   const [selectedOption, setSelectedOption] = useState<string | null>(null);
   const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

   const handleOptionClick = (option: string) => {
      setSelectedOption(option);
      toggleDropdown();
   };

   return (
      <div
         id="dropdown-menu"
         className="relative group  border hover:border-neutral-200 border-white dark:border-neutral-800 dark:hover:border-neutral-700 h-[32px] w-38"
      >
         <div className=" py-1 px-3   flex flex-row items-center  " onClick={toggleDropdown}>
            {icon ? <img className="w-5 h-5 mr-2  stroke-neutral-800 fill-neutral-800 " src={`data:image/svg+xml;utf8,${icon}`} /> : null}

            <p className="cursor-default text-sm">{value}</p>
            <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth={1.5}
               stroke="currentColor"
               className="w-3 h-3 ml-[10px] group-hover:top-[2px] top-0 relative transition-[top] duraiton-100"
            >
               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
         </div>
         {isDropdownOpen && (
            <div
               id="dropdown-menu"
               className="absolute z-10 border border-neutral-700  top-full mt-2 w-[200px] py-1 bg-neutral-800  shadow-lg  ring-1 ring-black ring-opacity-5"
            >
               {options.map((option, i) => (
                  <div key={option} className=" px-4 py-1  text-xs text-white hover:bg-pink-600   flex flex-row items-center" onClick={actions[i]}>
                     {icons?.length ? <img className="w-5 h-5 mr-2  stroke-white" src={`data:image/svg+xml;utf8,${icons[i]}`} /> : null}

                     {option}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default Dropdown;
