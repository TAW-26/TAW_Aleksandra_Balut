import http from "k6/http";
import { sleep } from "k6";
export const options = {
    vus: 50,          // 50 równoległych użytkowników
    duration: "30s",  // test trwa 30 sekund
};
export default function () {
    http.get("http://localhost:3100/api/events");
    sleep(1); // przerwa 1 sekundy między żądaniami
}