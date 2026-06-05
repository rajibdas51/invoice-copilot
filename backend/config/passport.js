import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Already has a Google account — just log in
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // Email already registered manually — link Google to it
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          user.authProvider = "google";
          await user.save();
          return done(null, user);
        }

        // Brand new user — create account
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          authProvider: "google",
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

export default passport;
