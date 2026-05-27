import { Request, Response } from 'express';
import { UserService } from '../modules/services/user.service';
export class UserController {
    private userService = new UserService();
    public getUserById = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'Uzytkownik nie istnieje' });
            }
            const { _id, email, username } = user;
            res.status(200).json({ id: _id, email, username });
        } catch (error) {
            res.status(500).json({ error: 'B??d serwera podczas pobierania u?ytkownika' });
        }
    };
}