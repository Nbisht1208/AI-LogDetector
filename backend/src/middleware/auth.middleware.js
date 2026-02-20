import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  console.log('Authorization header:', req.headers.authorization);

  const token = req.headers.authorization?.split(" ")[1];
  console.log("Auth Middleware - Token:", token);

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id + role
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
