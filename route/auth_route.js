const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    async (req, res, next) => {
      res.json({
        message: 'Signup successful',
        user: req.user
      });
    }
);

router.post(
    '/login',
    async (req, res, next) => {
      passport.authenticate(
        'login',
        async (err, user, info) => {
          try {
            if (err || !user) {
              return res.status(404).json({
                status: false,
                message: 'Invalid email or password.'
              });
            }
  
            req.login(
              user,
              { session: false },
              async (error) => {
                if (error) return next(error);
  
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, process.env.JWT_ACCESS_SECRET);
  
                return res.json({ token });
              }
            );
          } catch (error) {
            return next(error);  // This will be handled as 500 error as last middleware in index.js.
          }
        }
      )(req, res, next);
    }
);

module.exports = router;
