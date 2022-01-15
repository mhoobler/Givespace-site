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
  PRIMARY KEY (id)
);

CREATE TABLE listings (
  id UUID DEFAULT uuid_generate_v4(),
  catalogue_id UUID NOT NULL,
  description TEXT,
  price NUMERIC,
  PRIMARY KEY (id),
  FOREIGN KEY (catalogue_id) REFERENCES catalogues (id) ON DELETE CASCADE
);

CREATE TABLE links (
  id UUID DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL,
  url TEXT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE labels (
  id UUID DEFAULT uuid_generate_v4(),
  catalogue_id UUID NOT NULL,
  listing_id UUID NOT NULL,
  url TEXT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (catalogue_id) REFERENCES catalogues (id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

INSERT INTO catalogues (
  user_id,
  title
) VALUES (
  'id1',
  'title1'
), (
  'id2',
  'title2'
), (
  'id3',
  NULL
);
