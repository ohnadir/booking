import React from 'react'
import { Link } from 'react-router-dom'

const Header =()=> {
    return (
        <div className='bg-[#003580]'>
            <div className='max-w-7xl mx-auto px-3 '>
                <div className='py-10'>
                    <h1 className='text-4xl text-white'>A lifetime of discounts? It's Genius.</h1>
                    <p>Get rewarded for your travels - unlock instant savings of  10% or more with a free Lamabooking account</p>
                    <div className='bg-blue-500'>
                        <Link to={'/login'}>login</Link>
                        <Link to={'/register'}>Register</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default  Header