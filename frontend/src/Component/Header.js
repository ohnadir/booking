import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../Styles/Header.css'
import { FaBed } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import { GiPerson } from 'react-icons/gi';
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";

const Header =()=> {
    const [destination, setDestination] = useState("");
    const [openDate, setOpenDate] = useState(false);
    const [dates, setDates] = useState([
        {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
        },
    ]);
    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
        room: 1,
    });
    const handleOption = (name, operation) => {
        setOptions((prev) => {
          return {
            ...prev,
            [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
          };
        });
      };

    return (
        <div className='bg-[#003580] '>
            <div className='max-w-7xl mx-auto px-3 relative'>
                <div className='py-10'>
                    <h1 className='text-4xl text-white'>A lifetime of discounts? It's Genius.</h1>
                    <p className='text-white py-4'>Get rewarded for your travels - unlock instant savings of  10% or more with a free Lamabooking account</p>
                    <div className='bg-[#0071c2] flex text-white gap-1 justify-start w-32 px-2 py-[3px]'>
                        <Link to={'/login'}> login</Link> / 
                        <Link to={'/register'}>  Register</Link>
                    </div>
                </div>
                <div className='option-container absolute bottom-[-20px]'>
                    <div className=' flex justify-between '>
                        <div className='option-item'>
                            <FaBed/>
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                className="headerSearchInput"
                                onChange={(e) => setDestination(e.target.value)}
                             />
                        </div>
                        <div className='option-item'>
                            <FaCalendarAlt/> 
                            <span
                                onClick={() => setOpenDate(!openDate)}
                                className="headerSearchText"
                                >{`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                                dates[0].endDate,
                                "MM/dd/yyyy"
                                )}`}
                            </span>
                            { openDate && (
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={(item) => setDates([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={dates}
                                    className="date"
                                    minDate={new Date()}
                                />
                            )}
                        </div>
                        <div className='option-item'> 
                            <GiPerson/>
                            <span
                                onClick={() => setOpenOptions(!openOptions)}
                                className="headerSearchText"
                                >
                                    {`${options.adult} adult · ${options.children} children · ${options.room} room`}
                            </span>
                            {openOptions && (
                                <div className="options">
                                    <div className="optionItem">
                                        <span className="optionText">Adult</span>
                                        <div className="optionCounter">
                                            <button
                                            disabled={options.adult <= 1}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("adult", "d")}
                                            >
                                            -
                                            </button>
                                            <span className="optionCounterNumber">
                                            {options.adult}
                                            </span>
                                            <button
                                            className="optionCounterButton"
                                            onClick={() => handleOption("adult", "i")}
                                            >
                                            +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="optionItem">
                                        <span className="optionText">Children</span>
                                        <div className="optionCounter">
                                            <button
                                            disabled={options.children <= 0}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("children", "d")}
                                            >
                                            -
                                            </button>
                                            <span className="optionCounterNumber">
                                            {options.children}
                                            </span>
                                            <button
                                            className="optionCounterButton"
                                            onClick={() => handleOption("children", "i")}
                                            >
                                            +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="optionItem">
                                        <span className="optionText">Room</span>
                                        <div className="optionCounter">
                                            <button
                                            disabled={options.room <= 1}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("room", "d")}
                                            >
                                            -
                                            </button>
                                            <span className="optionCounterNumber">
                                            {options.room}
                                            </span>
                                            <button
                                            className="optionCounterButton"
                                            onClick={() => handleOption("room", "i")}
                                            >
                                            +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default  Header;