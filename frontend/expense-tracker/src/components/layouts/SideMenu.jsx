import React from 'react';
import { SIDE_MENU_DATA } from '../../utils/data';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

const SideMenu = () => {
    const { user, clearUser } = useContext(UserContext);

    const navigate = useNavigate();
    
  return (
    <div>SideMenu</div>
  )
}

export default SideMenu;