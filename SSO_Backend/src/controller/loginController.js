
import { v4 as uuidv4 } from 'uuid';
import loginRegisterService from '../service/loginRegisterService';
import { createJWT } from '../middleware/JWTAction';
import 'dotenv/config';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import db from '../models/index';
const getLoginPage = (req, res) => {

    const serviceURL = req.query.serviceURL; 
    return res.render("login.ejs", {
        redirectURL: serviceURL
    })
}

const verifySSOToken = async (req, res) => {
    try {
    //return jwt, refresh token
    const ssoToken = req.body.ssoToken;

    //check ssoToken
    if (req.user && req.user.code && req.user.code === ssoToken){
        const refreshToken= uuidv4();

        //update user
        await loginRegisterService.updateUserRefreshToken(req.user.email, refreshToken);

        //create access token
        let payload = { 
            email: req.user.email,
            groupWithRoles: req.user.groupWithRoles,
            username: req.user.username,
        }

        let token = createJWT(payload);

        // set cookies
        res.cookie('access_token', token, {
            maxAge: 15 * 60 * 1000,    // 15 minute
            httpOnly: true, // Chi sever co the doc duoc
            domain: process.env.COOKIE_DOMAIN,
            path: "/"
        })

        res.cookie('refresh_token', refreshToken, {
            maxAge: 60 * 60 * 1000,    // 60 minute
            httpOnly: true, // Chi sever co the doc duoc
            domain: process.env.COOKIE_DOMAIN,
            path: "/"
        })

        const resData = {
            access_token: token,
            refresh_token: refreshToken,
            email: req.user.email,
            groupWithRoles: req.user.groupWithRoles,
            username: req.user.username,
        }
        //destroy session 
        req.session.destroy(function (err) {
            req.logout();
        });

        return res.status(200).json({
            EM: 'ok',
            EC: 0,
            DT: resData
        })
    } else {
        return res.status(401).json({
            EM: 'not match ssotoken',
            EC: 1,
            DT: ''
        })
    }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'something wrong in the server...',
            EC: -1,
            DT: ''
        })
    }
    
}

const getResetPassword = (req, res) => {
    return res.render("change-password.ejs")
}

const sendOTP = async(req, res) => {
    let transpoter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GOOGLE_APP_EMAIL,
            pass: process.env.GOOGLE_APP_PASSWORD,
        },
    });

    const OTP = Math.floor(100000 + Math.random() * 900000);
    console.log(">>> START SENDING EMAIL");

    try {
        const info = await transpoter.sendMail({
            from: process.env.GOOGLE_APP_EMAIL,
            to: `${req.body.email}`,
            subject: "Verify Your Account in SSO Website",
            html: `
                <body>
                    <div class="container" style="margin: 0 auto; width: 100%; max-width: 600px; padding: 0 0px; padding-bottom: 10px; border-radius: 5px; line-height: 1.8;">
                        <strong style="font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #333;">Dear User,</strong>
                        <p style="font-family: Poppins, sans-serif; color: #333;">
                            We have received a login request for your account. For security purposes, please verify your identity by providing the following One-Time Password (OTP).
                            <br />
                            <br />
                            <b style="font-family: Poppins, sans-serif; color: #333;">Your One-Time Password (OTP) verification code is:</b>
                        </p>
                        <h2 class="otp" style="background: linear-gradient(to right, #00bc69 0, #00bc88 50%, #00bca8 100%); margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${OTP}</h2>
                        <p style="font-family: Poppins, sans-serif; color: #333; font-size: 0.9em;">
                            <strong>Your OTP code is valid for 5 minutes.</strong>
                            <br />
                            <br />
                            If you did not initiate this login request, please disregard this message. Please ensure the confidentiality of your OTP and do not share it with anyone.
                            <br />
                            <strong>Do not forward or give this code to anyone.</strong>
                            <br />
                            <br />
                            <strong>Thank you for using SSO Website.</strong>
                            <br />
                            <br />
                            Best regards,
                            <br />
                            <strong>Group 22</strong>
                        </p>

                        <hr style="border: none; border-top: 0.5px solid #131111" />
                        <div class="footer" style="color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
                            <p>This email can't receive replies.</p>
                            <p style="font-family: Poppins, sans-serif; color: #333;">
                                For more information about SSO Website and your account, visit <strong>tan.lamhoangce22@hcmut.edu.vn</strong>
                            </p>
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <div class="email-info" style="color: #666666; font-weight: 400; font-size: 13px; line-height: 18px; padding-bottom: 6px;">
                            <span>
                                This email was sent to
                                <a href="mailto:hoangtanlam2004@gmail.com" style="text-decoration: none; color: #00bc69;">hoangtanlam2004@gmail.com</a>
                            </span>
                        </div>
                        <div class="email-info" style="color: #666666; font-weight: 400; font-size: 13px; line-height: 18px; padding-bottom: 6px;">
                            &copy; 2024 Group 22 - Cryptography and Network Security (CO3069).
                        </div>
                    </div>
                </body>
            `,
        });
        console.log(">>> END SENDING EMAIL");
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email.',
            email: req.body.email
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP. Please try again later.'
        });
    }
}

// Hàm kiểm tra và xác nhận mật khẩu
const validatePasswords = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match.' };
    }
    if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    return { success: true };
};

const updatePassword = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Cập nhật mật khẩu mới cho người dùng
    const result = await db.User.update(
        { password: hashedPassword },  // Cập nhật trường password
        { where: { email: email } }    // Tìm người dùng theo email
    );
    
    // Kiểm tra xem có người dùng nào được cập nhật không
    if (result[0] === 0) {
        throw new Error('User not found or password not updated.');
    }
    
    return { success: true };
};


const changePassword = async (req, res) => {
    const { email, code, password, confirmPassword } = req.body;

    // Kiểm tra các trường yêu cầu
    if (!email || !code || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    // Kiểm tra mật khẩu và mật khẩu xác nhận có khớp không
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match."
        });
    }

    console.log(">>> START UPDATING PASSWORD");
    try {

        // Tiến hành thay đổi mật khẩu
        const updateResult = await updatePassword(email, password);

        // Nếu mật khẩu được cập nhật thành công
        if (updateResult.success) {
            console.log(">>> END UPDATING PASSWORD");
            return res.status(200).json({
                success: true,
                message: "Password updated successfully."
            });
        }

        // Trường hợp không thành công (có thể không tìm thấy user)
        return res.status(400).json({
            success: false,
            message: "Failed to update password."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update password. Please try again later."
        });
    }
};

const goHome = (req, res) => {
    return res.render("home.ejs");
}

const goIntroduction = (req, res) => {
    return res.render("introduction.ejs");
}

const goSource = (req, res) => {
    return res.render("source.ejs");
}

module.exports = {
    getLoginPage, verifySSOToken, getResetPassword, sendOTP, 
    changePassword, validatePasswords, updatePassword, goHome,
    goIntroduction, goSource};