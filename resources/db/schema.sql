DROP TABLE IF EXISTS cards;
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    shortcode VARCHAR UNIQUE NOT NULL,
    owner VARCHAR NOT NULL,
    repo VARCHAR NOT NULL,
    color VARCHAR NOT NULL
);

DROP INDEX IF EXISTS shortcode_ix;
CREATE INDEX shortcode_ix ON cards USING hash (shortcode);
