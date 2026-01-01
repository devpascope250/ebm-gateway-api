import { fetch, request } from "undici";

export abstract class ApiServices {

    public async request(url: string, method: string, body?: any): Promise<any> {
        return await request(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => response.body.json())
            .catch(error => console.error('Error:', error));
    }

    public async fetch(url: string, method: string, body?: any): Promise<any> {
        return await fetch(url, {
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