import './Header.scss'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doLogout } from '../../redux/action/accountAction';


const Header = () => {
    const user = useSelector(state => state.account.userInfo);
    const dispatch = useDispatch();
    const handleLogin = () => {
        // redicrect to SSO
        //http://localhost:8080/login?serviceURL=http://localhost:3000/
        window.location.href = `${process.env.REACT_APP_BACKEND_SSO_LOGIN}?serviceURL=${process.env.REACT_APP_SERVICE_URL}`;
    }

    const handleSignUp = () => {
        // redicrect to SSO
        //http://localhost:8080/signup?serviceURL=http://localhost:3000/
        window.location.href = `${process.env.REACT_APP_BACKEND_SSO_SIGNUP}?serviceURL=${process.env.REACT_APP_SERVICE_URL}`;
    }

    const handleLogout = () => {
        dispatch(doLogout());
    }

    const handleAppNavigation = (appName) => {
        if (user && user.access_token) {
            // Nếu người dùng đã đăng nhập
            if (appName === "home") {
                // Điều hướng đến trang Home
                window.location.href = `${process.env.REACT_APP_BACKEND_SSO_HOME}?serviceURL=${process.env.REACT_APP_SERVICE_URL}`;
            } else if (appName === "introduction") {
                // Điều hướng đến trang Introduction
                window.location.href = `${process.env.REACT_APP_BACKEND_SSO_INTRODUCTION}?serviceURL=${process.env.REACT_APP_SERVICE_URL}`;
            } else {
                window.location.href = `${process.env.REACT_APP_BACKEND_SSO_SOURCE}?serviceURL=${process.env.REACT_APP_SERVICE_URL}`;
            }
        } else {
            // Nếu người dùng chưa đăng nhập, điều hướng đến trang login
            window.location.href = `${process.env.REACT_APP_BACKEND_SSO_LOGIN}?serviceURL=${process.env.REACT_APP_SERVICE_URL}`;
        }
    };    

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/"><img src="/logoBK.png" alt="Logo" className="logo" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">        
                        <Nav className="ms-auto">
                            <div className="dropdown-wrapper">
                                {user && user.access_token ? (
                                    <NavDropdown title={user.email} id="basic-nav-dropdown">
                                        <NavDropdown.Item onClick={() => handleLogout()}>Log out</NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    <NavDropdown title="Setting" id="basic-nav-dropdown">
                                        <NavDropdown.Item onClick={() => handleLogin()}>Log in</NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => handleSignUp()}>Sign up</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Main content container */}
            <div className="main-container">
                {/* Main content (Left) */}
                <div className="left-panel">
                    <Nav className="flex-column introduction-panel">
                        <h4>Welcome to SSO Website</h4>
                        <p>Content for the selected application will appear here.</p>
                        <hr className="section-divider" />

                        {/* App Descriptions */}
                        <div className="app-descriptions">
                            <div className="app-description">
                                <h5>Home</h5>
                                <p>Overview of the project and SSO integration, showcasing how apps are connected.</p>
                            </div>
                            <div className="app-description">
                                <h5>Introduction</h5>
                                <p>Details about the course, group, semester, and project members.</p>
                            </div>
                            <div className="app-description">
                                <h5>Source</h5>
                                <p>Link to the GitHub repository containing the project source code and documentation.</p>
                            </div>
                        </div>
                    </Nav>
                </div>
                {/* Sidebar (Right) */}
                <div className="sidebar">
                    <Nav className="flex-column">
                        <Nav.Link as={NavLink} onClick={() => handleAppNavigation("home")} className="sidebar-item">
                            <img src="/home.png" alt="home" className="sidebar-icon" />
                            <span className="sidebar-text">Home</span>
                        </Nav.Link>

                        <Nav.Link as={NavLink} onClick={() => handleAppNavigation("introduction")} className="sidebar-item">
                            <img src="/introduction.png" alt="introduction" className="sidebar-icon" />
                            <span className="sidebar-text">Introduction</span>
                        </Nav.Link>

                        <Nav.Link as={NavLink} onClick={() => handleAppNavigation("source")} className="sidebar-item">
                            <img src="/source.png" alt="source" className="sidebar-icon" />
                            <span className="sidebar-text">Source</span>
                        </Nav.Link>
                        {/* Add more applications here */}
                    </Nav>
                </div>
                {/* Footer (Copyright) */}
                <footer className="footer">
                    <div className="footer-content">
                        <p>&copy; {new Date().getFullYear()} Group 22 - Semester 241 - Cryptography and Network Security (CO3069)</p>
                        <p>Ho Chi Minh City University of Technology - HCMUT</p>
                    </div>
                </footer>
            </div>
        </>
    );
}


export default Header;