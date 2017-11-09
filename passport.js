const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const { JWT_SECRET } = require('./config/index')
const User = require('./models/user')

/*
Creates a new instance of JwtStrategy.
JwtStrategy needs two arguments: jwtFormRequest and secretOrKey
jwtFormRequest is the token that is sent with the request
secretOrKey will be the JWT secret key

Here, the jwtFormRequest is sent in the request header

After that, a user is looked for. If no user is found, an error is returned
*/

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    const user = User.findById(payload.sub)
 
    if (!user) {
      return done(null, false)
    }
 
    done(null, user)
  } catch(err) {
    done(err, false)
  }
}))

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
 
  try {
    const user = await User.findOne({ email })
     
      if (!user) {
        return done(null, false)
      }
     
      const isMatch = await user.isValidPassword(password)
     
      if (!isMatch) {
        return done(null, false)
      }
     
      done(null, user)
 
  } catch (error) {
    done(error, false)
  }
   
}))
