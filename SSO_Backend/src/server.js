require("dotenv").config();
import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api";
import configCors from "./config/cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { configPassport } from './controller/passportController'
import connectDB from './config/connectDB';
import configSession from "./config/session";
import flash from 'connect-flash';
// import connection from "./config/connectDB";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static('public'));

//cònig flash mess
app.use(flash());
app.use(express.json());

//config cors
configCors(app);
//connectDB();

//config view engine
configViewEngine(app);

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config cookie -parser
app.use(cookieParser());

configSession(app);
//test connection db
// connection();
configPassport();

//init web routes
initWebRoutes(app);
initApiRoutes(app);

app.get('/change-password', (req, res) => {
    const redirectURL = req.query.serviceURL || '/login'; // Lấy tham số query serviceURL hoặc mặc định là '/'
    res.render('change-password', { redirectURL }); // Render file signup.ejs với redirectURL
});

app.post('/change-password', async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    // Bước 1: Kiểm tra mật khẩu và mật khẩu xác nhận
    const passwordValidation = validatePasswords(password, confirmPassword);
    if (!passwordValidation.success) {
        return res.status(400).json({ message: passwordValidation.error });
    }

    // Bước 2: Cập nhật mật khẩu mới vào cơ sở dữ liệu
    const result = await updatePassword(email, password);
    if (result.success) {
        return res.status(200).json({ message: "Password updated successfully." });
    } else {
        return res.status(400).json({ message: result.error });
    }
});


// Route cho trang signup
app.get('/signup', (req, res) => {
    const redirectURL = req.query.serviceURL || '/'; // Lấy tham số query serviceURL hoặc mặc định là '/'
    res.render('signup', { redirectURL }); // Render file signup.ejs với redirectURL
});


app.get('/home', (req, res) => {
    const redirectURL = req.query.serviceURL || '/'; // Lấy tham số query serviceURL hoặc mặc định là '/'
    res.render('home', { redirectURL }); // Render file signup.ejs với redirectURL
});

app.get('/introduction', (req, res) => {
    const redirectURL = req.query.serviceURL || '/'; // Lấy tham số query serviceURL hoặc mặc định là '/'
    res.render('introduction', { redirectURL }); // Render file signup.ejs với redirectURL
});

app.get('/source', (req, res) => {
    const redirectURL = req.query.serviceURL || '/'; // Lấy tham số query serviceURL hoặc mặc định là '/'
    res.render('source', { redirectURL }); // Render file signup.ejs với redirectURL
});

//req => middleware => res
app.use((req, res) => {
    return res.send('404 not found')
})

// configPassport();

app.listen(PORT, () => {
    console.log(">>> JWT Backend is running on the port = " + PORT);
})