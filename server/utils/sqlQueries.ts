export const fullCatalogueQuery = (whereString?: string | null) => {
  return ` 
  -- JOIN Labels to Listing-Labels (prep join table)
  WITH listing_labels_join AS (
    SELECT lila.id,
      lila.listing_id,
      -- label fields
      json_build_object(
        'id', la.id,
        'catalogue_id', la.catalogue_id,
        'name',la.name,
        'link_url',la.link_url,
        'ordering',la.ordering,
        'is_private',la.is_private,
        'created',la.created,
        'updated',la.updated
      ) AS label
    FROM listing_labels lila
    LEFT JOIN labels la ON lila.label_id = la.id  
  ), 
  -- JOIN Links & Labels to Listings
  listings_links_labels_join AS (
    SELECT li.id,
      li.catalogue_id,
      li.name,
      li.link_url,
      li.image_url,
      li.description,
      li.ordering,
      li.show_price,
      li.price,
      li.updated,
      li.created,
      (
        SELECT json_agg(lk.*) AS links
        FROM links lk WHERE li.id = lk.listing_id
      ),
      (
        SELECT json_agg(lila.*) AS labels
        FROM listing_labels_join lila WHERE lila.listing_id = li.id
      )
    FROM listings li
  )

  -- Avoid "GROUP BY" and "DISTINCT" with Aggregates
  SELECT 
      c.id,
      c.edit_id,
      c.user_id,
      c.status,
      c.title,
      c.description,
      c.views,
      c.header_image_url,
      c.header_color,
      c.author,
      c.profile_picture_url,
      c.event_date,
      c.location,
      c.created,
      c.updated,
      (
        SELECT json_agg(la.*) AS labels
        FROM labels la WHERE la.catalogue_id = c.id
      ),
      (
        SELECT json_agg(lia) AS listings
        FROM listings_links_labels_join lia WHERE lia.catalogue_id = c.id
      )         
  FROM catalogues c ${whereString || ""};
  `;
};

export const myCataloguesQuery = (whereString?: string | null) => {
  return `
  SELECT 
    c.id,
    c.edit_id,
    c.user_id,
    c.status,
    c.title,
    c.description,
    c.views,
    c.header_image_url,
    c.header_color,
    c.author,
    c.profile_picture_url,
    c.event_date,
    c.location,
    c.created,
    c.updated,
    (
      SELECT json_agg(json_build_object(
        'id', li.id,
        'image_url', li.image_url
      )) AS listings
      FROM listings li WHERE li.catalogue_id = c.id
    )         
  FROM catalogues c
  ${whereString || ""};
  `;
};

export const fullListingLabelQuery = (whereString?: string | null) => {
  return `
  SELECT lila.id,
    lila.listing_id,
    -- label fields
    json_build_object(
      'id', la.id,
      'catalogue_id', la.catalogue_id,
      'name',la.name,
      'link_url',la.link_url,
      'ordering',la.ordering,
      'is_private',la.is_private,
      'created',la.created,
      'updated',la.updated
    ) AS label
  FROM listing_labels lila
  LEFT JOIN labels la ON lila.label_id = la.id
  ${whereString || ""};
  `;
};

export const fullListingQuery = (whereString?: string | null) => {
  return `
  WITH listing_labels_join AS (
    SELECT lila.id,
      lila.listing_id,
      -- label fields
      json_build_object(
        'id', la.id,
        'catalogue_id', la.catalogue_id,
        'name',la.name,
        'link_url',la.link_url,
        'ordering',la.ordering,
        'is_private',la.is_private,
        'created',la.created,
        'updated',la.updated
      ) AS label
    FROM listing_labels lila
    LEFT JOIN labels la ON lila.label_id = la.id  
  )
  SELECT li.id,
    li.catalogue_id,
    li.name,
    li.link_url,
    li.image_url,
    li.description,
    li.ordering,
    li.show_price,
    li.price,
    li.updated,
    li.created,
    (
      SELECT json_agg(lk.*) AS links
      FROM links lk WHERE li.id = lk.listing_id
    ),
    (
      SELECT json_agg(lila.*) AS labels
      FROM listing_labels_join lila WHERE lila.listing_id = li.id
    )
  FROM listings li
  ${whereString || ""};
  `;
};
