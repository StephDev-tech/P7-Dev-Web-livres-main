//import { verify } from 'jsonwebtoken'; MODIFIER CAR ERREUR EN CONSOLE
import pkg from 'jsonwebtoken';
const { verify } = pkg;
import dotenv from 'dotenv'; 

dotenv.config();

 // eslint-disable-next-line no-undef
 const jwtSecret = process.env.JWT_SECRET

export default (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = verify(token, jwtSecret)
        const userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}