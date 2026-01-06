// Migration script to sync published field with status field
// Run this once to fix existing posts
// Usage: node scripts/migrate-post-status.cjs

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    published: Boolean,
    status: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

async function migratePostStatus() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to database');

        // Find all posts where published is true but status is not 'published'
        const postsToUpdate = await Post.find({
            published: true,
            status: { $ne: 'published' }
        });

        console.log(`📝 Found ${postsToUpdate.length} posts to mark as published`);

        // Update each post
        for (const post of postsToUpdate) {
            post.status = 'published';
            await post.save();
            console.log(`  ✓ Updated post: "${post.title}" (${post._id})`);
        }

        // Also update posts where published is false but status is not 'draft'
        const draftsToUpdate = await Post.find({
            published: false,
            status: { $ne: 'draft' }
        });

        console.log(`📝 Found ${draftsToUpdate.length} draft posts to update`);

        for (const post of draftsToUpdate) {
            post.status = 'draft';
            await post.save();
            console.log(`  ✓ Updated draft: "${post.title}" (${post._id})`);
        }

        // Find posts with no status set
        const noStatusPosts = await Post.find({
            $or: [
                { status: { $exists: false } },
                { status: null },
                { status: '' }
            ]
        });

        console.log(`📝 Found ${noStatusPosts.length} posts with no status`);

        for (const post of noStatusPosts) {
            post.status = post.published ? 'published' : 'draft';
            await post.save();
            console.log(`  ✓ Set status for: "${post.title}" (${post._id}) -> ${post.status}`);
        }

        console.log('\n✅ Migration completed successfully!');
        console.log(`   Total posts updated: ${postsToUpdate.length + draftsToUpdate.length + noStatusPosts.length}`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

migratePostStatus();
