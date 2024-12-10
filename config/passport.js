import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from '../database/init.js';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true
    },
    async function(request, accessToken, refreshToken, profile, done) {
      try {
        const user = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM users WHERE google_id = ?', [profile.id], (err, user) => {
            if (err) reject(err);
            resolve(user);
          });
        });

        if (user) {
          return done(null, user);
        }

        const result = await new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO users (google_id, username, email) VALUES (?, ?, ?)',
            [profile.id, profile.displayName, profile.emails[0].value],
            function(err) {
              if (err) reject(err);
              resolve(this.lastID);
            }
          );
        });

        const newUser = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM users WHERE id = ?', [result], (err, user) => {
            if (err) reject(err);
            resolve(user);
          });
        });

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
