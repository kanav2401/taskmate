import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authMiddleware(req, res, next) {

try {

const token = req.cookies.accessToken;

if (!token) {
return res.status(401).json({
message: "Unauthorized"
});
}

const decoded = jwt.verify(
token,
process.env.JWT_SECRET
);

const user = await User.findById(decoded.id);

if (!user) {
return res.status(401).json({
message: "User not found"
});
}

req.user = user;

next();

}catch(err){

console.log("AUTH ERROR:",err.message);

return res.status(403).json({
message:"Invalid token"
});

}

}
