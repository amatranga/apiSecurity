const JWT = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_SECRET } = require('../config/index')
 
/*
Function to create a new token for the user
To create a token, a payload is required. The payload contains the claims.
In this case, the issuer, subject, issuedAt, and expiration are all set
*/
signToken = ((user) => {
  return JWT.sign({
    iss: 'ApiAuth',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, JWT_SECRET)
})
 
 
module.exports = {
 
  /*
  signup is called when creating a new user.
  Email and password are obtained from the request body.
  After checking if an email address already exists, signToken is called
  with on the user.
  */
  signup: async (req, res, next) => {
    console.log('UsersController.signup() called')
 
    const { email, password } = req.value.body
 
    const foundUser = await User.findOne({ email })
    if (foundUser) {
      return res.status(403).json({ error: 'Email is already in use' })
    }
    const newUser = new User({ email, password })
    await newUser.save()
 
    const token = signToken(newUser)
 
    res.status(200).json({ token })
  },
 
  /*
  signin handles signing users in.
  When a user signs in, they are passed through signToken()
  */
  signin: async (req, res, next) => {
 
    const token = signToken(req.user)
    res.status(200).json({ token })
  },
 
  /*
  secret defines a route that can only be accessed by authenticated users
  */
  secret: async (req, res, next) => {
    res.json({ secret: "resource" });
  }
}
