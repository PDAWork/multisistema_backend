const model = require("../db/models/index");
const axios = require('axios');
const jwt = require('jsonwebtoken');
require("dotenv").config();

//Авторизация пользователя в системе
async function signIn(req, res) {
    const user = {
        login: req.body.login,
        password: req.body.password,
    }
    let accessToken = "";
    let refreshToken = "";
    if (!user.login || !user.password) {
        res.status(400).json({
            errorMessage: "Не все поля были заполнены"
        });
        return;
    }

    const userRequest = await model.User.findOne({where: {login: user.login}});

    if (userRequest == null) {
        try {
            const result = await axios.post("https://api.saures.ru/1.0/login", {
                "email": user.login,
                "password": user.password,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(result.data.errors.length);
            if (result.data.errors.length !== 0)
                if (result.data.errors[0].name === "WrongCredsException") {
                    res.status(400).json({
                        message: "Неправильный email или пароль"
                    });
                    return;
                }
            const resultUserProfile = await axios.get(`https://api.saures.ru/1.0/user/profile?sid=${result.data.data.sid}`)
            const data = {
                email: user.login,
            };
            let token = generateToken(data);
            const UserProfile = {
                login: user.login,
                password: user.password,
                firstName: resultUserProfile.data.data.firstname,
                lastName: resultUserProfile.data.data.lastname,
                phone: resultUserProfile.data.data.phone,
                sid: result.data.data.sid,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken
            }
            model.User.create(UserProfile).then(result => {
                res.status(201).json(UserProfile);
            }).catch(error => {
                console.log(error)
            });
            return;
        } catch (e) {
            console.log(e);
            res.status(400).json({
                message: "Попробуйте чуть позже авторизоваться"
            });
            return;
        }
    }
    const data = {
        email: user.login,
    };
    let token = generateToken(data);
    userRequest.refreshToken = token.refreshToken //|| undefined
    await userRequest.save();
    const UserProfile = {
        login: userRequest.login,
        password: userRequest.password,
        firstName: userRequest.firstName,
        lastName: userRequest.lastName,
        phone: userRequest.phone,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
    }

    res.status(200).json(UserProfile);
}

function generateToken(data) {
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15'
    });

    return {
        refreshToken: refreshToken,
        accessToken: accessToken
    }

}


async function refreshToken(req, res) {
    const refreshToken = req.body?.token
    const userQuery = await model.User.findOne({
        where: {
            refreshToken: refreshToken
        }
    })

    if (refreshToken == null) return res.status(401).json({
        message: "Пользователь не авторизован"
    }).end()

    if (!userQuery) return res.status(403).end()

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).end()
        const data = {
            email: jwt.decode(refreshToken).email
        }

        const token = generateToken(data);
        userQuery.refreshToken = token.refreshToken;
        await userQuery.save();
        res.json({
            accessToken: token.accessToken
        })

    })

}

//Регистрация пользователя в системе
async function signUp(req, res) {
}


module.exports = {
    signIn: signIn,
    signUp: signUp,
    refreshToken: refreshToken
}