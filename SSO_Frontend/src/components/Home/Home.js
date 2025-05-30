import { useEffect, useRef, useState } from "react";
// import "./Home.css" // Include your CSS/SCSS styles
import { useSelector } from "react-redux";
//import logoBK from "../public/logoBK.png"; // Update paths based on your project structure
//import avatar from "../public/avatar.jpg"; // Update paths based on your project structure


const Home = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        nickname: "",
        gender: "Male",
        country: "",
        language: "",
        email: "user@hcmut.edu.vn", // Example email, replace dynamically
    });
    const user = useSelector(state => state.user?.user);
    useEffect(() => {
        if(!user) {
            alert('You need to be logged in to see your profile');
        }
    }, [user]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleLogout = () => {
        window.location.href = "/"; // Adjust route if necessary
    };
    return (
        <div className="profile-page">
            <div className="header">
                <a href="/home"> </a>
                <div className="username">{formData.fullName || "Username"}</div>
                {/* <button onClick={handleLogout}>Log out</button> */}
            </div>
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-info">
                        {/* <img src={avatar} alt="User Avatar" /> */}
                        <div>
                            <h2>{formData.fullName || "Username"}</h2>
                            <p>{formData.email}</p>
                        </div>
                    </div>
                    <button>Edit</button>
                </div>
                <div className="profile-form">
                    <div>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            placeholder="Your fullname"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Nickname</label>
                        <input
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            placeholder="Your nickname"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label>Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            placeholder="Your country"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Language</label>
                        <input
                            type="text"
                            name="language"
                            value={formData.language}
                            placeholder="Your language"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Email Address</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            disabled
                        />
                    </div>
                </div>
                <div className="profile-footer">
                    <button>Change password</button>
                </div>
            </div>
            <div className="footer">
                Copyright (C) 2024 Group 22 - Cryptography and Network Security (CO3069)
                <br />
                Semester 241 - Ho Chi Minh City University of Technology (HCMUT - VNUHCM)
            </div>
        </div>
    )
}

export default Home;