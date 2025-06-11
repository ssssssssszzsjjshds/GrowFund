import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

// Serialize/deserialize for sessions
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id).then((user) => done(null, user))
);

// Determine callback URLs dynamically based on environment
const GOOGLE_CALLBACK_URL =
  process.env.NODE_ENV === "production"
    ? `${process.env.PRODUCTION_URL}/api/auth/google/callback`
    : "http://localhost:5000/api/auth/google/callback";

const FACEBOOK_CALLBACK_URL =
  process.env.NODE_ENV === "production"
    ? `${process.env.PRODUCTION_URL}/api/auth/facebook/callback`
    : "http://localhost:5000/api/auth/facebook/callback";

// Google OAuth strategy
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("Missing Google OAuth credentials!");
  throw new Error("Google OAuth credentials are required!");
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
            });
          }
          done(null, user);
        } catch (error) {
          console.error("Error during Google OAuth:", error);
          done(error, null);
        }
      }
    )
  );
}

// Facebook OAuth strategy
if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
  console.error("Missing Facebook OAuth credentials!");
  throw new Error("Facebook OAuth credentials are required!");
} else {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "emails"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ facebookId: profile.id });
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails?.[0]?.value || "",
              facebookId: profile.id,
            });
          }
          done(null, user);
        } catch (error) {
          console.error("Error during Facebook OAuth:", error);
          done(error, null);
        }
      }
    )
  );
}

// Debug environment variables in development mode
if (process.env.NODE_ENV !== "production") {
  console.log("Google CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
  console.log("Facebook CLIENT_ID:", process.env.FACEBOOK_CLIENT_ID);
}

export default passport;