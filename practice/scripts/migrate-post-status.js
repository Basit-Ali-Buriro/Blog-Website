// Migration script to sync published field with status field
// Run this once to fix existing posts

import dbConnect from './lib/db/mongodb.js';
import Post from './lib/models/Post.js';

async function migratePostStatus() {
    try {
        await dbConnect();
        console.log('Connected to database');

        // Find all posts where published is true but status is not 'published'
        const postsToUpdate = await Post.find({
            published: true,
            status: { $ne: 'published' }
        });

        console.log(`Found ${postsToUpdate.length} posts to update`);

        // Update each post
        for (const post of postsToUpdate) {
            post.status = 'published';
            await post.save();
            console.log(`Updated post: ${post.title} (${post._id})`);
        }

        // Also update posts where published is false but status is not 'draft'
        const draftsToUpdate = await Post.find({
            published: false,
            status: { $ne: 'draft' }
        });

        console.log(`Found ${draftsToUpdate.length} draft posts to update`);

        for (const post of draftsToUpdate) {
            post.status = 'draft';
            await post.save();
            console.log(`Updated draft post: ${post.title} (${post._id})`);
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migratePostStatus();
