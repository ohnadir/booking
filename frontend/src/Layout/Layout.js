import React from 'react';
import Navbar from '../Component/Shared/Navbar';
const Layout=(props)=>{
    return(
        <>
            <Navbar></Navbar>
            {props.children}
        </>
    )
}
export default Layout;