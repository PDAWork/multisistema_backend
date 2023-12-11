const model = require("../db/models");
const jwt = require("jsonwebtoken");
const axios = require("axios");

/// Получить один объект но с сокращенной информацией
function getObjectShortened(req, res) {}

/// Получить один объект но с полной информацией
function getObjectFull(req, res) {
  res.send(req.params["id"]);
}

/// Получить все объекты пользователя и подробную информацию
async function getObjects(req, res) {
  // // console.log(jwt.decode(req.headers["authorization"], {complete: true}))
  // console.log(jwt.decode (req.headers["authorization"].split(' ')[1]))

  const userId = req.params.userId;

  const user = await model.User.findOne({
    where: {
      id: userId,
    },
  });

  if (user == null) {
    res.status(404).json({
      message: "Такого пользователя нет",
    });
    return;
  }
  const object = await model.Object.findAll({
    where: {
      userId: userId,
    },
  });

  if (object.length === 0) {
    const sid = user.sid;

    try {
      const resultUserObject = await getObjectSaurus(user);
      for (
        let index = 0;
        index < resultUserObject.data.data.objects.length;
        index++
      ) {
        const object = resultUserObject.data.data.objects[index];
        const result = await model.Object.create({
          id: object.id,
          house: object.house,
          lable: object.label,
          accountId: object.object_company_account,
          personalAccount: object.personal_account,
          connectDate: object.connect_dt,
          enable: object.enable,
          balanceObject: 0,
          userId: userId,
          accesLevel: object.access_level,
          objectCompanyName: object.object_company_name,
          objectCompanyUrl: object.object_company_url,
        });
      }

      res.status(200).json(
        object.findAll({
          where: {
            userId: userId,
          },
        })
      );

      return;
    } catch (error) {
      console.log(error);
    }
    res.status(404).json({
      message: "У пользователя нет ни одного объект",
    });
    return;
  }

  let isCheck = false;
  const currentDate = new Date();
  const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;

  for (let index = 0; index < object.length; index++) {
    console.log(object[index].updatedAt);
    const updateDate = new Date(object[index].updatedAt);
    const timeDifference = currentDate.getTime() - updateDate.getTime();
    if ((isCheck = timeDifference > oneWeekInMillis)) {
      break;
    }
    console.log(isCheck);
  }

  if (isCheck) {
    const resultUserObject = await getObjectSaurus(user);
    for (
      let index = 0;
      index < resultUserObject.data.data.objects.length;
      index++
    ) {
      const object = resultUserObject.data.data.objects[index];
      const result = await model.Object.update(
        {
          house: object.house,
          lable: object.label,
          accountId: object.object_company_account,
          personalAccount: object.personal_account,
          connectDate: object.connect_dt,
          enable: object.enable,
          accesLevel: object.access_level,
          objectCompanyName: object.object_company_name,
          objectCompanyUrl: object.object_company_url,
        },
        { where: { id: object.id } }
      );

      if (result == 0) {
        await model.Object.create({
          id: object.id,
          house: object.house,
          lable: object.label,
          accountId: object.object_company_account,
          personalAccount: object.personal_account,
          connectDate: object.connect_dt,
          enable: object.enable,
          balanceObject: 0,
          userId: userId,
          accesLevel: object.access_level,
          objectCompanyName: object.object_company_name,
          objectCompanyUrl: object.object_company_url,
        });
      }
    }

    const object = await model.Object.findAll({
      where: {
        userId: userId,
      },
    });
    res.status(200).json(object);
    return;
  }

  if (object.length != 0) {
    res.status(200).json(object);
    return;
  }

  res.status(200).json(object);
}

async function getObjectSaurus(user) {
  const userRequest = await axios.post(
    "https://api.saures.ru/1.0/login",
    {
      email: user.login,
      password: user.password,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const resultUserObject = await axios.get(
    `https://api.saures.ru/1.0/user/objects?sid=${userRequest.data.data.sid}`
  );
  return resultUserObject;
}

module.exports = {
  getObjectShortened,
  getObjectFull,
  getObjects,
};
