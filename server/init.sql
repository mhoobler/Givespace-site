DROP TABLE IF EXISTS listing_labels;
DROP TABLE IF EXISTS labels;
DROP TABLE IF EXISTS links;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS catalogues;

CREATE TABLE catalogues (
  id UUID DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT,
  description TEXT,
  views INT,
  header_image_url TEXT,
  header_color TEXT,
  edit_id TEXT,
  author TEXT,
  profile_picture_url TEXT,
  event_date DATE,
  created TIMESTAMP,
  updated TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE listings (
  id UUID DEFAULT uuid_generate_v4(),
  catalogue_id UUID NOT NULL,
  name TEXT,
  image_url TEXT,
  description TEXT,
  order INT,
  show_price BOOLEAN,
  price NUMERIC,
  created TIMESTAMP,
  updated TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (catalogue_id) REFERENCES catalogues (id) ON DELETE CASCADE
);

CREATE TABLE links (
  id UUID DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL,
  url TEXT NOT NULL,
  created TIMESTAMP,
  updated TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE labels (
  id UUID DEFAULT uuid_generate_v4(),
  catalogue_id UUID NOT NULL,
  url TEXT NOT NULL,
  is_private BOOLEAN,
  created TIMESTAMP,
  updated TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (catalogue_id) REFERENCES catalogues (id) ON DELETE CASCADE,
)

CREATE TABLE listing_labels (
  id UUID DEFAULT uuid_generate_v4(),
  label_id UUID NOT NULL,
  listing_id UUID NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (label_id) REFERENCES labels (id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

INSERT INTO catalogues (
  user_id,
  title
) VALUES (
  'user1',
  'title1'
), (
  'user1',
  'title2'
), (
  'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDIyNjE1MDB9.yOzQeZ-X2cRMZn4B7xRw2AhSDpjGLOXN_vawJayEB-c',
  NULL
), (
  'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDIyNjE1MDB9.yOzQeZ-X2cRMZn4B7xRw2AhSDpjGLOXN_vawJayEB-c',
  'title3'
);
