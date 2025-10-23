-- Add link column to project_journey_steps table
ALTER TABLE project_journey_steps
ADD COLUMN link TEXT;

COMMENT ON COLUMN project_journey_steps.link IS 'Optional URL linking to the live demo or details for this journey step';
