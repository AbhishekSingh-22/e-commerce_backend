import jwt from "jsonwebtoken";

export const signAccessToken = (id) => {
    return jwt.sign({ id },
    process.env.ACCESS_SECRET, 
    { expiresIn: '1m' });
}

export const signRefreshToken = (id) => {
    return jwt.sign({ id },
    process.env.REFRESH_SECRET, 
    { expiresIn: '2m' });
}