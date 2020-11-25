import React from 'react';
import { Menu } from 'antd';


function LeftMenu(props) {
    return (
        <Menu mode={props.mode}>
            <Menu.Item key="mail">
                <a href="/">Home</a>
            </Menu.Item>
            <Menu.Item key="favorite">
                {/* Path is /favorite if we look at App.js */}
                <a href="/favorite">Favorite Movies</a>
            </Menu.Item>
        </Menu>
    );
}

export default LeftMenu;