const model = require("../db/models/index");
const axios = require('axios');

//Авторизация пользователя в системе
async function signIn(req, res) {
    const user = {
        login: req.body.login,
        password: req.body.password,
    }

    if (!user.login || !user.password) {
        res.status(400).json({
            errorMessage: "Не все поля были заполнены"
        });
        return;
    }

    const userRequest = await model.User.findOne({
        where:
            {login: user.login}

    });

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
            const UserProfile = {
                login: user.login,
                password: user.password,
                firstName: resultUserProfile.data.data.firstname,
                lastName: resultUserProfile.data.data.lastname,
                phone: resultUserProfile.data.data.phone,
                sid: result.data.data.sid
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
    res.status(200).json(userRequest);
}


//Регистрация пользователя в системе
async function signUp(req, res) {
}


module.exports = {
    signIn: signIn,
    signUp: signUp
}