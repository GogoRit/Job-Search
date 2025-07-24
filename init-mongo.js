// MongoDB initialization script
db = db.getSiblingDB('job_search_assistant');

// Create collections
db.createCollection('users');
db.createCollection('resumes');
db.createCollection('jobs');
db.createCollection('messages');

// Create indexes
db.users.createIndex({ "created_at": 1 });
db.resumes.createIndex({ "user_id": 1 });
db.resumes.createIndex({ "created_at": 1 });
db.jobs.createIndex({ "user_id": 1 });
db.jobs.createIndex({ "stage": 1 });
db.jobs.createIndex({ "company": 1 });
db.jobs.createIndex({ "created_at": 1 });
db.messages.createIndex({ "job_id": 1 });
db.messages.createIndex({ "user_id": 1 });
db.messages.createIndex({ "created_at": 1 });

print('Database initialized successfully');
