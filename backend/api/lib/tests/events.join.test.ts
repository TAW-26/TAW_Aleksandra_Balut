import request from "supertest";
import app from "../app";
describe("POST /api/events/:id/join", () => {
    it("powinno dodać użytkownika do listy uczestników", async () => {
        const email = `join${Date.now()}@mail.com`;
        const password = "test123";

        await request(app).post("/api/auth/register").send({
            email,
            password,
            username: "Tester"
        });

        const login = await request(app).post("/api/auth/login").send({
            email,
            password
        });
        const token = login.body.token;

        const created = await request(app)
            .post("/api/events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Wydarzenie testowe",
                description: "Opis",
                date: new Date(),
                location: "Miasto",
                maxParticipants: 5,
                category: "spotkania"
            });
        const eventId = created.body._id;

        const join = await request(app)
            .post(`/api/events/${eventId}/join`)
            .set("Authorization", `Bearer ${token}`);
        expect(join.statusCode).toBe(200);
        expect(join.body).toHaveProperty("event");
        expect(join.body.event.participants.length).toBe(1);
    });
});