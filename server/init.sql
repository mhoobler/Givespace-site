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
  ordering FLOAT NOT NULL,
  show_price BOOLEAN DEFAULT true,
  price NUMERIC,
  created TIMESTAMP DEFAULT NOW(),
  updated TIMESTAMP DEFAULT NOW(),
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
  ordering FLOAT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  created TIMESTAMP DEFAULT NOW(),
  updated TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (catalogue_id) REFERENCES catalogues (id) ON DELETE CASCADE
);

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
  title,
  header_image_url
) VALUES (
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'bfb04418-6c9f-42c7-a97f-2f9ce8cf3e07',
  '6a3a2967-0258-4caf-8fef-f844c060b2f2',
  'title1',
  'https://storage.googleapis.com/givespace-pictures/skull.jpg'
); 

INSERT INTO labels (
  id,
  catalogue_id,
  name,
  ordering
) VALUES (
  'd5a998be-205c-4a5e-8f41-05f808cdc9e1',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'label0',
  0
), (
  'fbe5c847-5419-487a-a803-e7b2ca9bfa7e',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'label1',
  1
), (
  '51692a78-c744-4f8e-a2c5-d4a422fc657d',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'label2',
  2
), (
  '35b2a996-ab59-4dcd-9885-9a2a54d1608c',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'label3',
  3
), (
  '35b4a996-ab59-4dcd-9885-9a2a54d1608c',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'label4',
  4
), (
  '35b5a996-ab59-4dcd-9885-9a2a54d1608c',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'label5',
  5
), (
  '35b6a996-ab59-4dcd-9885-9a2a54d1608c',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'label6',
  6
), ( 
  '35b7a996-ab59-4dcd-9885-9a2a54d1608c',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'label7',
  7
), (
  '35b8a996-ab59-4dcd-9885-9a2a54d1608c',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'label8',
  8
);

INSERT INTO listings (
  id,
  catalogue_id,
  name,
  ordering
) VALUES (
  '7f0251d2-0d33-457a-89ef-5a0e6a5c36be',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'item0',
  0
), (
  '261a378d-97d7-46fa-a5c2-83c99e4fa7b6',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'item1',
  1
), (
  '262a378d-97d7-46fa-a5c2-83c99e4fa7b6',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'item2',
  2
), (
  '263a378d-97d7-46fa-a5c2-83c99e4fa7b6',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'item3',
  3
), (
  '264a378d-97d7-46fa-a5c2-83c99e4fa7b6',
  'f470498b-71ff-470a-8c61-1fc4101449dd',
  'item4',
  4
);
