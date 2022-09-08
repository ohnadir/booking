import {useNavigate} from 'react-router-dom';
import { MdHotel } from 'react-icons/md';
import { FaPlane } from 'react-icons/fa';
import { FaTaxi } from 'react-icons/fa';
import { AiFillCar } from 'react-icons/ai';
import '../../Styles/Navbar.css'
const Navbar = (props) => {
    const navigate = useNavigate();
    return ( 
        <div className='bg-[#003580]'>
            <div className='max-w-7xl mx-auto px-3 py-3 ' >
                <div className='flex justify-between items-center'>
                    <div>
                        <p className='text-white'>Booking</p>
                    </div>
                    <div className='flex gap-6 '>
                        <button className='bg-white px-2 py-[2px]' onClick={()=>navigate('/login')}>Login</button>
                        <button className='bg-white px-2 py-[2px]' onClick={()=>navigate('/register')}>Register</button>
                    </div>
                </div>
                <div className='item-container items-center flex gap-7 text-white mt-5 '>
                    <div className='item-active flex items-center gap-2'>
                        <MdHotel/> <span>Stays</span>
                    </div>
                    <div className='item flex items-center gap-2'>
                        <FaPlane/> <span>Flights</span>
                    </div>
                    <div className='item flex items-center gap-2'>
                        <AiFillCar/> <span>Car rentals</span>
                    </div>
                    <div className='item flex items-center gap-2'>
                        <FaPlane/> <span>Attractions</span>
                    </div>
                    <div className='item flex items-center gap-2'>
                        <FaTaxi/> <span>Airport Taxis</span>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Navbar;