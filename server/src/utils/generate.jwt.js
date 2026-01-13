import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return res.cookie("jwt", token, {
    httpOnly: true,
    // use secure cookies in production
    secure: process.env.NODE_ENV !== "development",
    // prevent CSRF attacks
    sameSite: "strict",
    // 30 days
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
