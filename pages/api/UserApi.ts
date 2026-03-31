import { APIRequestContext } from '@playwright/test';

// ADD THE 'export' KEYWORD HERE
export interface PostPayload {
    title: string;
    body: string;
    userId: number;
}

export class UserApi {
    private request: APIRequestContext;
    // Base URL for the posts endpoint
    private baseUrl: string = 'https://jsonplaceholder.typicode.com/posts';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    // This fixes your post.spec.ts
    async getPostById(id: number) {
        return await this.request.get(`${this.baseUrl}/${id}`);
    }

    // This fixes your post.spec.ts (using the 'New' naming convention)
    async createNewPost(data: object) {
        return await this.request.post(this.baseUrl, { data });
    }

    // This fixes your lifecycle.spec.ts
    async createPost(data: object) {
        return await this.request.post(this.baseUrl, { data });
    }

    // This fixes your lifecycle.spec.ts
    async updatePost(id: number, data: object) {
        return await this.request.put(`${this.baseUrl}/${id}`, { data });
    }

    // This fixes your lifecycle.spec.ts
    async deletePost(id: number) {
        return await this.request.delete(`${this.baseUrl}/${id}`);
    }
}