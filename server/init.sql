DROP TABLE IF EXISTS listing_labels;
DROP TABLE IF EXISTS labels;
DROP TABLE IF EXISTS links;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS catalogues;

CREATE TABLE catalogues (
  id UUID DEFAULT uuid_generate_v4(),
  edit_id UUID DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  status TEXT DEFAULT 'public',
  title TEXT DEFAULT 'Untitled Catalogue',
  description TEXT DEFAULT '',
  views INT DEFAULT 0 NOT NULL,
  header_image_url TEXT,
  header_color TEXT DEFAULT '#000000',
  author TEXT,
  profile_picture_url TEXT,
  event_date DATE,
  location TEXT,
  created TIMESTAMP DEFAULT NOW(),
  updated TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE listings (
  id UUID DEFAULT uuid_generate_v4(),
  catalogue_id UUID NOT NULL,
  name TEXT NOT NULL,
  link_url TEXT,
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
  link_url TEXT NOT NULL,
  created TIMESTAMP,
  updated TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE labels (
  id UUID DEFAULT uuid_generate_v4(),
  catalogue_id UUID NOT NULL,
  name TEXT NOT NULL,
  link_url TEXT,
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
  user_id
) VALUES (
  'id'
), (
  'id'
), (
  '6a3a2967-0258-4caf-8fef-f844c060b2f2'
);

INSERT INTO catalogues (
  id,
  edit_id,
  user_id,
  title
) VALUES (
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'bfb04418-6c9f-42c7-a97f-2f9ce8cf3e07',
  '6a3a2967-0258-4caf-8fef-f844c060b2f2',
  'title1'
);

