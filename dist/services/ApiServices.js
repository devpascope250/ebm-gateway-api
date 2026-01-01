"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiServices = void 0;
const undici_1 = require("undici");
class ApiServices {
    async request(url, method, body) {
        return await (0, undici_1.request)(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => response.body.json())
            .catch(error => console.error('Error:', error));
    }
    async fetch(url, method, body) {
        return await (0, undici_1.fetch)(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .catch(error => console.error('Error:', error));
    }
}
exports.ApiServices = ApiServices;
