// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data
//   },
// }
const User = require("../model/User")
const handleLogout = async (req, res) => {
  // on client, also delete the accessToken

  const cookies = req.cookies

  if (!cookies?.jwt) return res.sendStatus(204) // No conent to send
  //console.log(cookies.jwt)
  const refreshToken = cookies.jwt

  // Is refershToken in db?
  // const foundUser = usersDB.users.find(
  //   (person) => person.refreshToken === refreshToken
  // )
  const foundUser = await User.findOne({refreshToken}).exec()
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: 'None', secure: true })
    return res.sendStatus(204) // successful, No content
  }
  
  //find refresh toj=ken, delete the refershtoken  
// const otherUsers = usersDB.users.filter(person => person.refreshToken != foundUser.refreshToken)

// const currentUser = { ...foundUser, refreshToken: ' '}
// usersDB.setUsers([...otherUsers, currentUser])

//     await fsPromises.writeFile(
//         path.join(__dirname, '..', 'model', 'users.json'),
//         JSON.stringify(usersDB.users)
    
// )

foundUser.refreshToken = ''
const result = await foundUser.save()
console.log(result)

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true}) // secure: true - only serves n https
  res.sendStatus(204) //sucess, no content 
}

module.exports = { handleLogout }
