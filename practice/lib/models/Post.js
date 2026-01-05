import mongoose from 'mongoose';

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Helper function to calculate reading time
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      trim: true,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          return tags.length <= 10;
        },
        message: 'A post can have maximum 10 tags'
      }
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    // Keep published for backward compatibility
    published: {
      type: Boolean,
      default: false,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
    metaDescription: {
      type: String,
      maxlength: 160,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save middleware to auto-generate slug and reading time
postSchema.pre('save', function (next) {
  // Generate slug from title if not provided
  if (!this.slug && this.title) {
    this.slug = generateSlug(this.title);
  }

  // Calculate reading time from content
  if (this.content) {
    this.readingTime = calculateReadingTime(this.content);
  }

  // Auto-generate excerpt from content if not provided
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200).trim() + '...';
  }

  // Auto-generate meta description if not provided
  if (!this.metaDescription && this.content) {
    this.metaDescription = this.content.substring(0, 160).trim();
  }

  // Sync published field with status for backward compatibility
  this.published = this.status === 'published';

  next();
});

// Index for better query performance
postSchema.index({ slug: 1 });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ author: 1, status: 1 });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;