import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/data.model';
import { config } from '../../config';

export class UserService {
    private readonly saltRounds = 10;

    public async register(userData: any) {
        const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);
        const newUser = new UserModel({
            ...userData,
            password: hashedPassword
        });
        return await newUser.save();
    }
    public async login(email: string, password: string) {
        const user = await UserModel.findOne({ email });
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            config.jwtSecret, 
            { expiresIn: '24h' }
        );

        return { token, user: { id: user._id, name: user.username, email: user.email } };
    }
    public async getUserById(id: string) {
        return await UserModel.findById(id).select('email username').exec();
    }
}