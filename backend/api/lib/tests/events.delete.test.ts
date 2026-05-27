import request from "supertest";
import app from "../app";
async function loginUser() {
    const email = `event${Date.now()}@mail.com`;
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
    return login.body.token;
}
describe("DELETE /api/events/:id", () => {
    it("powinno usunąć wydarzenie", async () => {
        const token = await loginUser();
        const created = await request(app)
            .post("/api/events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Event do usunięcia",
                description: "Opis",
                date: new Date().toISOString(),
                location: "Miasto",
                maxParticipants: 5,
                category: "sport"
            });
        expect(created.statusCode).toBe(201);
        expect(created.body).toHaveProperty("_id");
        const eventId = created.body._id;
        const deleted = await request(app)
            .delete(`/api/events/${eventId}`)
            .set("Authorization", `Bearer ${token}`);
        expect([200, 204]).toContain(deleted.statusCode);
        const fetched = await request(app).get(`/api/events/${eventId}`);
        expect(fetched.statusCode).toBe(404);
        expect(fetched.body).toHaveProperty("message", "Nie znaleziono wydarzenia");
    });
});