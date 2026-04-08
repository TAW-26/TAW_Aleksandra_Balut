import { Router } from 'express';
import { UserService } from '../modules/services/user.service';

const router = Router();
const userService = new UserService();

router.post('/register', async (req, res) => {
    try {
        const user = await userService.register(req.body);
        res.status(201).json({ message: 'Użytkownik zarejestrowany', userId: user._id });
    } catch (error) {
        res.status(400).json({ error: 'Email jest już zajęty lub dane są błędne' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const result = await userService.login(req.body.email, req.body.password);
        if (!result) return res.status(401).json({ message: 'Błędny email lub hasło' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

export default router;