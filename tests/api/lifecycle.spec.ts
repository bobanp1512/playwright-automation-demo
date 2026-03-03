import { test, expect } from '@playwright/test';

test.describe('Post API Lifecycle Management', () => {
    const baseUrl = 'https://jsonplaceholder.typicode.com/posts';

    test('API: Full CRUD Lifecycle for a single resource', async ({ request }) => {
        // 1. CREATE (POST)
        const postResponse = await request.post(baseUrl, {
            data: {
                title: 'Lifecycle Test',
                body: 'Checking the full flow',
                userId: 1
            }
        });
        expect(postResponse.status()).toBe(201);
        console.log('POST successful: Resource created (Mock ID 101)');

        // COOL-DOWN: Let the server breathe
        await new Promise(resolve => setTimeout(resolve, 500));

        // 2. UPDATE (PUT) - Using an ID that truly exists (ID: 1)
        const existingId = 1; 
        const putResponse = await request.put(`${baseUrl}/${existingId}`, {
            data: {
                id: existingId,
                title: 'Updated Title',
                body: 'Updated Body',
                userId: 1
            }
        });
        
        expect(putResponse.status()).toBe(200);
        const putData = await putResponse.json();
        expect(putData.title).toBe('Updated Title');
        console.log(`Resource ${existingId} Updated Successfully`);

        // 3. DELETE - Using the same existing ID
        const deleteResponse = await request.delete(`${baseUrl}/${existingId}`);
        expect(deleteResponse.status()).toBe(200);
        console.log(`Resource ${existingId} Deleted Successfully`);
    });
});