import { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import mongoose from 'mongoose';

const userSchema = Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema);

export default User;
