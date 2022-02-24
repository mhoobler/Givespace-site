DROP TABLE IF EXISTS listing_labels;
DROP TABLE IF EXISTS labels;
DROP TABLE IF EXISTS links;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS catalogues;

CREATE TABLE catalogues (
  id TEXT NOT NULL,
  edit_id TEXT UNIQUE NOT NULL,
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

CREATE TRIGGER trigger_test_genid BEFORE INSERT ON catalogues FOR EACH ROW EXECUTE PROCEDURE unique_short_id2();

CREATE TABLE listings (
  id TEXT NOT NULL,
  catalogue_id TEXT NOT NULL,
  name TEXT,
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

CREATE TRIGGER trigger_test_genid BEFORE INSERT ON listings FOR EACH ROW EXECUTE PROCEDURE unique_short_id();

CREATE TABLE links (
  id TEXT NOT NULL,
  listing_id TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  created TIMESTAMP DEFAULT NOW(),
  updated TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TRIGGER trigger_test_genid BEFORE INSERT ON links FOR EACH ROW EXECUTE PROCEDURE unique_short_id();

CREATE TABLE labels (
  id TEXT NOT NULL,
  catalogue_id TEXT NOT NULL,
  name TEXT NOT NULL,
  link_url TEXT,
  ordering FLOAT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  created TIMESTAMP DEFAULT NOW(),
  updated TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (catalogue_id) REFERENCES catalogues (id) ON DELETE CASCADE
);

CREATE TRIGGER trigger_test_genid BEFORE INSERT ON labels FOR EACH ROW EXECUTE PROCEDURE unique_short_id();

CREATE TABLE listing_labels (
  id TEXT NOT NULL,
  label_id TEXT NOT NULL,
  listing_id TEXT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (label_id) REFERENCES labels (id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TRIGGER trigger_test_genid BEFORE INSERT ON listing_labels FOR EACH ROW EXECUTE PROCEDURE unique_short_id();

INSERT INTO catalogues (
  user_id
) VALUES (
  '6a3a2967-0258-4caf-8fef-f844c060b2f2'
);

INSERT INTO catalogues (
  title,
  user_id
) VALUES (
  'title1',
  '6a3a2967-0258-4caf-8fef-f844c060b2f2'
), (
  'title2',
  '6a3a2967-0258-4caf-8fef-f844c060b2f2'
); 

INSERT INTO labels (
  catalogue_id,
  name,
  ordering
) VALUES (
  (SELECT id FROM catalogues LIMIT 1),
  'label0',
  0
), (
  (SELECT id FROM catalogues LIMIT 1),
  'label1',
  1
), (
  (SELECT id FROM catalogues LIMIT 1),
  'label2',
  2
), (
  (SELECT id FROM catalogues LIMIT 1),
  'label3',
  3
);

INSERT INTO listings (
  catalogue_id,
  name,
  ordering
) VALUES (
  (SELECT id FROM catalogues LIMIT 1),
  'item0',
  0
), (
  (SELECT id FROM catalogues LIMIT 1),
  'item1',
  1
), (
  (SELECT id FROM catalogues LIMIT 1),
  'item2',
  2
), (
  (SELECT id FROM catalogues LIMIT 1),
  'item3',
  3
), (
  (SELECT id FROM catalogues LIMIT 1),
  'item4',
  4
), (
  (SELECT id FROM catalogues LIMIT 1),
  'item5',
  5
), (
  (SELECT id FROM catalogues LIMIT 1),
  'item6',
  6
), (
  (SELECT id FROM catalogues LIMIT 1),
  'item7',
  7
);

INSERT INTO links (
  listing_id,
  url,
  title
) VALUES (
  (SELECT id FROM listings LIMIT 1),
  'https://link0.com',
  'link0'
  
), (
  (SELECT id FROM listings LIMIT 1),
  'https://link1.com',
  'link1'
);
