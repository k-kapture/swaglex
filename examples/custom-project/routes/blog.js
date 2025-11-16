/**
 * Custom route handlers for the blog API
 */

// Mock data for demonstration
const mockArticles = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Getting Started with API Documentation',
    slug: 'getting-started-with-api-documentation',
    content: 'This is a comprehensive guide to API documentation...',
    excerpt: 'A brief introduction to API documentation best practices',
    author: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      username: 'johndoe',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe'
    },
    tags: ['api', 'documentation', 'tutorial'],
    published: true,
    publishedAt: '2023-01-01T00:00:00Z',
    viewCount: 1250,
    likeCount: 42,
    commentCount: 8,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

const mockComments = [
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    content: 'Great article! Very helpful for beginners.',
    author: {
      id: '123e4567-e89b-12d3-a456-426614174003',
      username: 'janedoe',
      email: 'jane.doe@example.com',
      firstName: 'Jane',
      lastName: 'Doe'
    },
    articleId: '123e4567-e89b-12d3-a456-426614174000',
    likes: 5,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  }
];

const mockUsers = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    username: 'johndoe',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Full-stack developer passionate about APIs',
    role: 'writer',
    articleCount: 15,
    followerCount: 250,
    followingCount: 180,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

// Article routes
const getArticles = (req, res) => {
  const { page = 1, limit = 10, author, tag, published = true, search } = req.query;

  let filteredArticles = [...mockArticles];

  // Apply filters
  if (author) {
    filteredArticles = filteredArticles.filter(article => article.author.id === author);
  }

  if (tag) {
    filteredArticles = filteredArticles.filter(article => article.tags.includes(tag));
  }

  if (published !== undefined) {
    filteredArticles = filteredArticles.filter(article => article.published === (published === 'true'));
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredArticles = filteredArticles.filter(article =>
      article.title.toLowerCase().includes(searchLower) ||
      article.content.toLowerCase().includes(searchLower)
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  res.json({
    articles: paginatedArticles,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredArticles.length,
      totalPages: Math.ceil(filteredArticles.length / limit)
    }
  });
};

const getArticleById = (req, res) => {
  const { id } = req.params;
  const article = mockArticles.find(a => a.id === id);

  if (!article) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Article not found',
      code: 404
    });
  }

  // Increment view count
  article.viewCount++;

  res.json(article);
};

const createArticle = (req, res) => {
  const { title, content, excerpt, tags, published } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Title and content are required',
      code: 400,
      details: [
        { field: 'title', message: 'Title is required' },
        { field: 'content', message: 'Content is required' }
      ]
    });
  }

  const newArticle = {
    id: Date.now().toString(),
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    content,
    excerpt: excerpt || content.substring(0, 150) + '...',
    author: req.user,
    tags: tags || [],
    published: published || false,
    publishedAt: published ? new Date().toISOString() : null,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockArticles.push(newArticle);
  res.status(201).json(newArticle);
};

// Comment routes
const getArticleComments = (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const articleComments = mockComments.filter(comment => comment.articleId === id);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedComments = articleComments.slice(startIndex, endIndex);

  res.json({
    comments: paginatedComments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: articleComments.length,
      totalPages: Math.ceil(articleComments.length / limit)
    }
  });
};

const addComment = (req, res) => {
  const { id } = req.params;
  const { content, parentId } = req.body;

  if (!content) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Comment content is required',
      code: 400,
      details: [{ field: 'content', message: 'Content is required' }]
    });
  }

  const newComment = {
    id: Date.now().toString(),
    content,
    author: req.user,
    articleId: id,
    parentId: parentId || null,
    likes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockComments.push(newComment);

  // Increment comment count on article
  const article = mockArticles.find(a => a.id === id);
  if (article) {
    article.commentCount++;
  }

  res.status(201).json(newComment);
};

// User routes
const getUserProfile = (req, res) => {
  // In a real app, you'd get this from the authenticated user
  const user = mockUsers[0];
  res.json(user);
};

const updateUserProfile = (req, res) => {
  const user = mockUsers[0];
  const { firstName, lastName, bio, avatar } = req.body;

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (bio) user.bio = bio;
  if (avatar) user.avatar = avatar;

  user.updatedAt = new Date().toISOString();

  res.json(user);
};

// Analytics routes
const getAnalytics = (req, res) => {
  const { period = 'month' } = req.query;

  const analytics = {
    period,
    totalArticles: mockArticles.length,
    totalComments: mockComments.length,
    totalUsers: mockUsers.length,
    totalViews: mockArticles.reduce((sum, article) => sum + article.viewCount, 0),
    topArticles: mockArticles
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(article => ({
        article,
        views: article.viewCount,
        likes: article.likeCount,
        comments: article.commentCount
      })),
    engagement: {
      avgViewsPerArticle: mockArticles.length > 0 ?
        mockArticles.reduce((sum, article) => sum + article.viewCount, 0) / mockArticles.length : 0,
      avgCommentsPerArticle: mockArticles.length > 0 ?
        mockArticles.reduce((sum, article) => sum + article.commentCount, 0) / mockArticles.length : 0,
      avgLikesPerArticle: mockArticles.length > 0 ?
        mockArticles.reduce((sum, article) => sum + article.likeCount, 0) / mockArticles.length : 0
    }
  };

  res.json(analytics);
};

// Search routes
const searchContent = (req, res) => {
  const { q, type = 'all', limit = 20 } = req.query;

  if (!q || q.length < 2) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Search query must be at least 2 characters long',
      code: 400
    });
  }

  const query = q.toLowerCase();
  let results = { query: q, totalResults: 0 };

  if (type === 'articles' || type === 'all') {
    results.articles = mockArticles
      .filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      )
      .slice(0, limit);
    results.totalResults += results.articles.length;
  }

  if (type === 'comments' || type === 'all') {
    results.comments = mockComments
      .filter(comment => comment.content.toLowerCase().includes(query))
      .slice(0, limit);
    results.totalResults += results.comments.length;
  }

  if (type === 'users' || type === 'all') {
    results.users = mockUsers
      .filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.bio?.toLowerCase().includes(query)
      )
      .slice(0, limit);
    results.totalResults += results.users.length;
  }

  res.json(results);
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  getArticleComments,
  addComment,
  getUserProfile,
  updateUserProfile,
  getAnalytics,
  searchContent
};