
import { test, expect } from '@playwright/test';
import { UserApi, PostPayload } from '../../pages/api/UserApi'; // Import both Class and Interface

test.describe('API: Full CRUD Lifecycle', () => {
    let userApi: UserApi;

    test.beforeEach(async ({ request }) => {
        userApi = new UserApi(request);
    });

    test('Should execute full Create, Update, and Delete flow', async () => {
        
        // 1. CREATE
        const newPost: PostPayload = { 
            title: 'Proton QA Portfolio Post', 
            body: 'Testing API Resilience', 
            userId: 1 
        };

        const postResponse = await userApi.createPost(newPost);
        expect(postResponse.status()).toBe(201);
        
        const postData = await postResponse.json();
        const createdId = postData.id; 
        // Note: JSONPlaceholder always returns 101 for new posts
        console.log(`Resource created with ID: ${createdId}`);

        // 2. UPDATE
        // We use a real ID (1) because JSONPlaceholder doesn't actually persist new data
        const updatePayload: Partial<PostPayload> = { 
            title: 'Updated Mid-Senior Title' 
        };

        const updateResponse = await userApi.updatePost(1, updatePayload);
        expect(updateResponse.status()).toBe(200);
        
        const updateData = await updateResponse.json();
        expect(updateData.title).toBe(updatePayload.title);

        // 3. DELETE
        const deleteResponse = await userApi.deletePost(1);
        expect(deleteResponse.status()).toBe(200);
        console.log(`Resource 1 deleted successfully.`);
    });
});







// import { test, expect } from '@playwright/test';
// import { UserApi } from '../../pages/api/UserApi';



// test('API: Full CRUD Lifecycle', async ({ request }) => {
//     const userApi = new UserApi(request);

//     // 1. CREATE: This works because the API simulates creation
//     const postResponse = await userApi.createPost({ 
//         title: 'New Playwright Post', 
//         body: 'Testing', 
//         userId: 1 
//     });
//     expect(postResponse.status()).toBe(201);
//     const postData = await postResponse.json();
//     console.log(`Mock ID created: ${postData.id}`); // This will be 101

//     // 2. UPDATE: Use an ID that actually exists in the JSONPlaceholder DB (e.g., 1)
//     const existingId = 1; 
//     const update = await userApi.updatePost(existingId, { 
//         title: 'Updated Title', 
//         userId: 1 
//     });
    
//     // Now it will return 200 because ID 1 exists
//     expect(update.status()).toBe(200); 
//     const updateData = await update.json();
//     expect(updateData.title).toBe('Updated Title');

//     // 3. DELETE: Use the same existing ID
//     const deleted = await userApi.deletePost(existingId);
//     expect(deleted.status()).toBe(200);
// });

// test('API: Full CRUD Lifecycle', async ({ request }) => {
//     const userApi = new UserApi(request);

//     // 1. CREATE: Post a new resource
//     const postResponse = await userApi.createPost({ 
//         title: 'New Playwright Post', 
//         body: 'Testing Lifecycle', 
//         userId: 1 
//     });
//     expect(postResponse.status()).toBe(201);
    
//     // Extract the ID the server generated
//     const postData = await postResponse.json();
//     const newId = postData.id; 
//     console.log(`Created resource with ID: ${newId}`);

//     // 2. UPDATE: Modify the resource we just created
//     // Note: JSONPlaceholder is a mock API, so it always returns ID 101 for new posts.
//     // In a real API, you'd use 'newId' here.
//     const update = await userApi.updatePost(newId, { 
//         title: 'Updated Title', 
//         userId: 1 
//     });
//     expect(update.status()).toBe(200);
    
//     const updateData = await update.json();
//     expect(updateData.title).toBe('Updated Title');

//     // 3. DELETE: Remove the specific resource
//     const deleted = await userApi.deletePost(newId);
//     expect(deleted.status()).toBe(200);
//     console.log(`Resource ${newId} deleted successfully.`);
// });