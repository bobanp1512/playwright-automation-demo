import { test, expect } from '@playwright/test';
import { UserApi } from '../../pages/api/UserApi';

test.describe('CRUD Mastery - POM Style', () => {
    let userApi: UserApi;

    test.beforeEach(async ({ request }) => {
        userApi = new UserApi(request);
    });

    test('POST: Should create a new post successfully', async () => {
        const payload = { title: 'Test', body: 'Body', userId: 1 };
        const response = await userApi.createNewPost(payload);
        
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.title).toBe(payload.title);
    });

    test('GET: Should retrieve post #1', async () => {
        const response = await userApi.getPostById(1);
        expect(response.status()).toBe(200);
    });

    test('GET: Should return 404 for non-existent post', async () => {
        const response = await userApi.getPostById(9999);
        expect(response.status()).toBe(404);
    });
});