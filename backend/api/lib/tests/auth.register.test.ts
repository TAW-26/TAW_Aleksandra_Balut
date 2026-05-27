import request from "supertest";
import app from "../app";
describe("POST /api/auth/register", () => {
    it("powinno zarejestrować użytkownika", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                email: `test${Date.now()}@mail.com`,
                password: "test123",
                username: "Tester"
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("userId");
    });
    it("powinno zwrócić błąd dla już istniejącego emaila", async () => {
        const email = `duplicate@mail.com`;
        // pierwsza rejestracja
        await request(app).post("/api/auth/register").send({
            email,
            password: "test123",
            username: "Tester"
        });
        // druga rejestracja — powinna paść
        const res = await request(app).post("/api/auth/register").send({
            email,
            password: "test123",
            username: "Tester"
        });
        expect(res.statusCode).toBe(400);
    });
});