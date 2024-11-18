import "react";
import { NavLink, Outlet } from 'react-router-dom';

import "./Layout.css";

const Layout = () => {
    return <>
        <div>
            <span className="nav-link"><NavLink to="/generate-keys">KeyGen</NavLink></span>
            <span className="nav-link"><NavLink to ="/dsa">Signature</NavLink></span>
        </div>
        <div>
            <Outlet/>
        </div>
    </>
}

export default Layout;
