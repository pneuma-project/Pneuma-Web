
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Menu, Icon, Badge } from 'antd';
const { SubMenu } = Menu;
// import logo from '../../static/image/logo.png';
// import logoNoText from '../../static/image/logo_no_text.png';
class Lefter extends React.Component {
    constructor(props) {
        super(props);
        // 权限相关
        this.state = {
            currentPath: window.location.pathname,
            currentSubMenu: '',
            initApproval: 0,
            headerLinkList: [{
                path: `/audience`,
                text: `我的人群`,
                img: 'team'
            }, {
                path: `/analysis/list`,
                text: `洞察分析`,
                img: 'alert'
            }]
        };
    }
    componentWillReceiveProps(nextProps) {
        this.getCurrentPath(nextProps);
        return nextProps;
    }
   

    getCurrentPath(props, currentSubMenu) {
        const { location } = props || window;
        const { headerLinkList } = this.state;
        headerLinkList.some((item) => {
            if (item.children) {
                item.children.some((childItem) => {
                    if (location.pathname.indexOf(childItem.path) === 0) {
                        this.setState({
                            currentPath: childItem.path,
                            currentSubMenu
                        });
                        return true;
                    }
                    return false;
                });
            }
            if (location.pathname.indexOf(item.path) === 0) {
                this.setState({
                    currentPath: item.path,
                    currentSubMenu
                });
                return true;
            }
            return false;
        });
    }
    getRedirectBlock() {
        const { userInfo: { logined, isWhite } } = this.props;
        const { location } = window;
        if (location.pathname !== '/' && (!logined || !isWhite)) {
            return (
                <Redirect to={{ pathname: '/' }} />
            );
        }
        if (logined) {
            if (location.pathname === '/') {
                return <Redirect to={{ pathname: '/audience' }} />;
            }
        }
    }
    
    getLefterBlock() {
        const { currentPath, headerLinkList, currentSubMenu, initApproval } = this.state;
        const { collapsed, waitingApproval } = this.props;
        return (
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[currentPath]}
                // defaultOpenKeys={[currentSubMenu]}
                inlineCollapsed={collapsed}
            >
                {
                    headerLinkList.map((item) => {
                        if (item.children) {
                            const path = item.children.map(el => el.path);
                            return (
                                <SubMenu
                                    key={item.path}
                                    className={path.indexOf(currentPath) !== -1 ? 'is-opacity' : ''}
                                    title={
                                        <span>
                                            <Icon type={item.img} />
                                            <span>{item.text}</span>
                                        </span>
                                    }
                                >
                                {
                                    item.children.map(childrenItem => {
                                        if (childrenItem.children) {
                                            const threePath = childrenItem.children.map(el => el.path);
                                            return (
                                                <SubMenu
                                                    key={childrenItem.path}
                                                    className={threePath.indexOf(currentPath) !== -1 ? 'three-children is-opacity' : 'three-children'}
                                                    title={childrenItem.text}
                                                >
                                                {
                                                    childrenItem.children.map((threeChildren) => {
                                                        return (
                                                            <Menu.Item key={threeChildren.path}>
                                                                {threeChildren.text}
                                                                <Link className="a-position"
                                                                    to={threeChildren.path}
                                                                    onClick={() => { this.menuOnClickHandler(threeChildren.path, threeChildren.subMenu); }}
                                                                >
                                                                </Link>
                                                            </Menu.Item>
                                                        );
                                                    })
                                                }
                                                </SubMenu>
                                            )
                                        } else {
                                            return (
                                                <Menu.Item key={childrenItem.path}>
                                                    {childrenItem.text}
                                                    <Link className="a-position"
                                                        to={childrenItem.path}
                                                        onClick={() => { this.menuOnClickHandler(childrenItem.path, item.subMenu); }}
                                                    >
                                                    </Link>
                                                </Menu.Item>
                                            );
                                        }
                                    })
                                }
                                </SubMenu>
                            );
                        } else {
                            return (
                                <Menu.Item key={item.path}>
                                    <Icon type={item.img} />
                                    <span>{item.text}</span>
                                    <Link className="a-position"
                                        to={item.path}
                                        onClick={() => { this.menuOnClickHandler(item.path); }}
                                    >
                                    </Link>
                                </Menu.Item>
                            );
                        }
                    })
                }
            </Menu>
        );
    }
    menuOnClickHandler(pathname, currentSubMenu = '') {
        this.getCurrentPath({
            location: {
                pathname
            }
        }, currentSubMenu);
    }
    render() {
        // const redirectBlock = this.getRedirectBlock();
        const LefterBlock = this.getLefterBlock();
        const { collapsed } = this.props;
        return (
            <div className="mod-lefter clearfix" style={!collapsed ? {width: '256px'} : {width: '80px', minWidth: '80px'}}>
                <div className="logo-bg">
                    {/* <img
                        src={!collapsed ? logo : logoNoText}
                        style={!collapsed ?
                            {height: '30px', width: '160px', verticalAlign: 'middle' } :
                            {height: '30px', width: '30px', verticalAlign: 'middle' }
                        }
                    /> */}
                </div>
                {LefterBlock}
                {/* {redirectBlock} */}
            </div>
        );
    }
}

export default Lefter;