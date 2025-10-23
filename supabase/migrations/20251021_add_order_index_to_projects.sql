-- Add order_index column to projects table for chronological ordering
ALTER TABLE projects
ADD COLUMN order_index INTEGER;

-- Set the order based on actual Git repository chronology
UPDATE projects SET order_index = 1 WHERE title = 'GVI MVP';
UPDATE projects SET order_index = 2 WHERE title = '100 Days CSS Challenge';
UPDATE projects SET order_index = 3 WHERE title = 'OFEKTIVE Fitness Studio';
UPDATE projects SET order_index = 4 WHERE title = 'Beili Photographer Portfolio';
UPDATE projects SET order_index = 5 WHERE title = 'Casona diez diez';
UPDATE projects SET order_index = 6 WHERE title = 'Sharon Fitness';
UPDATE projects SET order_index = 7 WHERE title = 'Mayart Candles - Full-Stack E-Commerce Platform';
UPDATE projects SET order_index = 8 WHERE title = 'Hand Sign Detection Model';
UPDATE projects SET order_index = 9 WHERE title = 'Cantaloupe AI - Recruitment Platform';

-- Add index for better query performance
CREATE INDEX idx_projects_order_index ON projects(order_index);