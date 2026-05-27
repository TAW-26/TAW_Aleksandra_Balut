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
describe("POST /api/events", () => {
    it("powinno utworzyć nowe wydarzenie", async () => {
        const token = await loginUser();
        const res = await request(app)
            .post("/api/events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test event",
                description: "Opis",
                date: new Date(),
                location: "Miasto",
                maxParticipants: 10,
                category: "sport"
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("title", "Test event");
    });
});