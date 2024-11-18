import "react";
import { NavLink, Outlet } from 'react-router-dom';

import "./Layout.css";

const Layout: React.FC = () => {
    return <>
        <div>
            <span className="nav-link"><NavLink to="/generate-keys">KeyGen</NavLink></span>
            <span className="nav-link"><NavLink to ="/rsa">RSA</NavLink></span>
        </div>
        <div>
            <Outlet/>
        </div>
    </>
}

export default Layout;
