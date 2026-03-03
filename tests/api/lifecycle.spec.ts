import { test, expect } from '@playwright/test';

test.describe('Post API Lifecycle Management', () => {
    test('API: Full CRUD Lifecycle for a single resource', async ({ request }) => {
        const baseUrl = 'https://jsonplaceholder.typicode.com/posts';

        // 1. CREATE (POST)
        const postResponse = await request.post(baseUrl, {
            data: {
                title: 'Lifecycle Test',
                body: 'Checking the full flow',
                userId: 1
            }
        });
        expect(postResponse.status()).toBe(201);
        const postData = await postResponse.json();
        const newId = postData.id; // Capture the dynamic ID
        console.log(`Resource Created with ID: ${newId}`);

        // 500ms sleep to let the server "breathe"
        await new Promise(resolve => setTimeout(resolve, 500));

        // 2. UPDATE (PUT) - Using the ID from Step 1
        const putResponse = await request.put(`${baseUrl}/${newId}`, {
            data: {
                id: newId,
                title: 'Updated Title',
                body: 'Updated Body',
                userId: 1
            }
        });
        expect(putResponse.status()).toBe(200);
        const putData = await putResponse.json();
        expect(putData.title).toBe('Updated Title');
        console.log(`Resource ${newId} Updated Successfully`);

        // 3. DELETE - Cleaning up the specific ID
        const deleteResponse = await request.delete(`${baseUrl}/${newId}`);
        expect(deleteResponse.status()).toBe(200);
        console.log(`Resource ${newId} Deleted Successfully`);
    });
});