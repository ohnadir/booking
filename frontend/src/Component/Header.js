import React from 'react'
import { Link } from 'react-router-dom'
import '../Styles/Header.css'

const Header =()=> {
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
                            <h1>Hotel </h1>
                        </div>
                        <div className='option-item'>Motel</div>
                        <div className='option-item'>Type</div>
                        <div className='option-item'>Button</div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default  Header;