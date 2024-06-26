import jwt from 'jsonwebtoken';

export function generateJWT(id: string, username: string) {
    const token = jwt.sign({id: id, username: username},
        process.env.JWT_SECRET_KEY as string,
        {expiresIn: '5 days'})
    return token
}

export function decodeJWT(token: string) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string)
    console.log(decoded)
    return decoded
}