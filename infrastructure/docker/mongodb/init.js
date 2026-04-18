// MongoDB initialization script
// Runs once when the container is first created

db = db.getSiblingDB('lensai_dev');

// Create collections with validators
db.createCollection('ai_generation_logs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['jobId', 'userId', 'provider', 'createdAt'],
      properties: {
        jobId: { bsonType: 'string' },
        userId: { bsonType: 'string' },
        provider: { enum: ['kling', 'runway', 'luma', 'openai', 'removebg', 'stability'] },
        createdAt: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('video_analytics');
db.createCollection('prompt_templates');

// Create indexes
db.ai_generation_logs.createIndex({ jobId: 1 }, { unique: true });
db.ai_generation_logs.createIndex({ userId: 1 });
db.ai_generation_logs.createIndex({ provider: 1 });
db.ai_generation_logs.createIndex({ createdAt: -1 });

db.video_analytics.createIndex({ videoId: 1 });
db.video_analytics.createIndex({ userId: 1 });
db.video_analytics.createIndex({ platform: 1 });

db.prompt_templates.createIndex({ styleId: 1 }, { unique: true });
db.prompt_templates.createIndex({ category: 1 });
db.prompt_templates.createIndex({ productTypes: 1 });

print('MongoDB lensai_dev initialized successfully');
