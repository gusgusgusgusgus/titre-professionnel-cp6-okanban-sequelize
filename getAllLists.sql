SELECT * FROM lists
ORDER BY position ASC, created_at DESC;

SELECT * FROM tasks
INNER JOIN lists ON tasks.list_id = lists.id
ORDER BY tasks.position ASC;

SELECT * FROM labels
INNER JOIN tasks_labels ON labels.id = tasks_labels.label_id
INNER JOIN tasks ON tasks.id = tasks_labels.task_id;