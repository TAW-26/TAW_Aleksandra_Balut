import request from "supertest";
import app from "../app";
describe("POST /api/auth/login", () => {
    it("powinno zalogować poprawnego użytkownika", async () => {
        const email = `login${Date.now()}@mail.com`;
        // rejestracja
        await request(app).post("/api/auth/register").send({
            email,
            password: "test123",
            username: "Tester"
        });
        // logowanie
        const res = await request(app).post("/api/auth/login").send({
            email,
            password: "test123"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("user");
    });
    it("powinno odrzucić błędne hasło", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "nonexisting@mail.com",
            password: "wrong"
        });
        expect(res.statusCode).toBe(401);
    });
});