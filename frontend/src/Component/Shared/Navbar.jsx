import {useNavigate} from 'react-router-dom';
const Navbar = (props) => {
    const navigate = useNavigate();
    return ( 
        <div className='bg-blue-600'>
            <div className='max-w-7xl mx-auto px-3 py-3 ' >
                <div className='flex justify-between items-center'>
                    <div>
                        <p className='text-white'>Booking</p>
                    </div>
                    <div className='flex gap-6 '>
                        <button className='bg-white px-2' onClick={()=>navigate('/register')}>Register</button>
                        <button className='bg-white px-2' onClick={()=>navigate('/login')}>Login</button>
                    </div>
                </div>
                <div>
                    
                </div>
            </div>
        </div>
     );
}
 
export default Navbar;