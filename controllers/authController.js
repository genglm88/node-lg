// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data
//   },
// }

const User = require('../model/User')

const bcrypt = require('bcrypt')

const jwt = require("jsonwebtoken")
// const fsPromises = require("fs").promises
// const path = require("path")

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are reqiired." })

  //const foundUser = usersDB.users.find((person) => person.username === user)
  const foundUser = await User.findOne({username: user})
  //usersDB.users.find((person) => person.username === user)
  if (!foundUser) return res.sendStatus(401) // Unauthorized
  //evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password)
  if (match) {
    const roles = Object.values(foundUser.roles)
    //create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      // no need to store roles in refreshToken, since refreshToken issues access Token
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "240s" }
    )

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    )

    // const otherUsers = usersDB.users.filter(
    //   (person) => person.username !== foundUser.username
    // )
    // const currentUser = { ...foundUser, refreshToken }
    // usersDB.setUsers([...otherUsers, currentUser])
    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(usersDB.users)
    // )
    foundUser.refreshToken = refreshToken
    const result = await foundUser.save()
    console.log(result)
    
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }) // one day not available for Javascript
    res.json({ accessToken })
  } else {
    res.sendStatus(401) //unauthorized
  }
}

module.exports = { handleLogin }
