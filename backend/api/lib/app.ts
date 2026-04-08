import express from 'express';
import { config } from './config';
import eventRoutes from './routes/event.routes';
import { EventController } from './controllers/event.controller';

class App {
    public app: express.Application;
    private eventController: EventController;



    constructor() {
        this.app = express();
        this.app.use(express.json());
        //this.eventController = new EventController();
        this.initializeRoutes();

        this.runExample();
    }
    private initializeRoutes() {
        
        this.app.use('/api/events', eventRoutes);

        
        this.app.use((req, res) => {
            res.status(404).json({ message: 'Endpoint nie istnieje' });
        });
    }

    private runExample(): void {
        console.log('--- Uruchamiam przykład użycia ---');

        const event1 = this.eventController.createEvent({
            title: 'Wspólne granie w Catan',
            description: 'Zapraszam sąsiadów na planszówki!',
            location: 'ul. Sezamkowa 4/12',
            category: 'gry',
            maxParticipants: 4
        }, 99);

        console.log('Utworzono wydarzenie:', event1);

        this.eventController.createEvent({
            title: 'Joga w parku',
            category: 'sport',
            location: 'Park Północny'
        }, 101);

        const allEvents = this.eventController.getAllEvents();
        console.log(`Liczba wszystkich wydarzeń: ${allEvents.length}`);

        const sportEvents = this.eventController.getAllEvents({ category: 'sport' });
        console.log('Wydarzenia sportowe:', sportEvents.map(e => e.title));
    }

    public listen(): void {
        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        });
    }
}
export default App;