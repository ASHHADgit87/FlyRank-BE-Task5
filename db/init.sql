CREATE TABLE
    IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks (title);

INSERT INTO
    tasks (title, done)
SELECT
    *
FROM
    (
        VALUES
            ('Buy milk', FALSE),
            ('Finish FlyRank BE-04 assignment', FALSE),
            ('Read Postgres documentation', TRUE)
    ) AS seed (title, done)
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            tasks
    );