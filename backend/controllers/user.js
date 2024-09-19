import { hash as _hash, compare } from 'bcrypt';

import pkg from 'jsonwebtoken';
const { sign } = pkg; 
import User from '../models/User.js';  
import dotenv from 'dotenv';
dotenv.config();
 

 // eslint-disable-next-line no-undef
 const jwtSecret = process.env.JWT_SECRET
const signup = (req, res) => {
    _hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}
const login = (req, res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (user === null) {
            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte'})
        } else {
            compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                    res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte'})
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: sign(
                            { userId: user._id },
                            jwtSecret,
                            { expiresIn: '24h'} 
                        )
                    })
                }
            })
            .catch(error => {
                res.status(500).json({ error })
            })
        }
    })
    .catch(error => {
        res.status(500).json({ error })
    })
}

export{signup, login}