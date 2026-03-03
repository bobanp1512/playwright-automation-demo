import { test, expect } from '@playwright/test';

test.describe('CRUD Mastery - JSONPlaceholder', () => {

    test('POST: Should create a new post successfully', async ({ request }) => {
        const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
            data: {
                title: 'My First API Test',
                body: 'Playwright is handling this like a pro.',
                userId: 1,
            }
        });

        // 201 is the standard HTTP status code for "Created"
        console.log(`Creation Status: ${response.status()}`);
        expect(response.status()).toBe(201);

        // Let's look at what the server sent back
        const body = await response.json();
        console.log('Server Response:', body);

        // Assertions on the returned JSON data
        expect(body.title).toBe('My First API Test');
        expect(body.id).toBeDefined(); // The server generates a new ID (usually 101)
    });

    test('GET: Should retrieve post #1', async ({ request }) => {
        const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.id).toBe(1);
        expect(body.userId).toBe(1);
        // Checking that the body is not empty
        expect(body.body.length).toBeGreaterThan(0);
    });


    test('PUT: Should update an existing post', async ({ request }) => {
        const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
            data: {
                id: 1,
                title: 'Updated Title',
                body: 'The content has changed.',
                userId: 1
            }
        });

        expect(response.status()).toBe(200); // 200 OK for successful update
        const body = await response.json();
        
        console.log('Update Response:', body);
        expect(body.title).toBe('Updated Title');
    });

    test('DELETE: Should remove a post', async ({ request }) => {
        const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');

        // Status 200 or 204 (No Content) is common for successful deletion
        console.log(`Delete Status: ${response.status()}`);
        expect(response.status()).toBe(200); 

        // After a delete, some APIs return an empty object or a success message
        const body = await response.json();
        expect(Object.keys(body).length).toBe(0); 
    });

    test('GET: Should return 404 for non-existent post', async ({ request }) => {
        // There are only 100 posts in JSONPlaceholder
        const response = await request.get('https://jsonplaceholder.typicode.com/posts/9999');

        // We EXPECT this to fail with a 404
        console.log(`Error Status: ${response.status()}`);
        expect(response.status()).toBe(404);
    });

});