import React from "react";
import { LabelContainer, Label } from "../../components";

import "./CatalogueItems.less";

type Props = {
  addLabel: (name: string) => void;
  deleteLabel: (id: string) => void;
  reorderLabel: (id: string, ordering: number) => void;
  isEditing: boolean;
  labels: Label[];
  items: null; // TODO: CHANGE THIS
};

const CatalogueItems: React.FC<Props> = ({
  labels,
  addLabel,
  deleteLabel,
  reorderLabel,
  isEditing,
}) => {
  return (
    <div className="row catalogue-items-container">
      {/* add item, sort */}
      <div className="row">
        <div className="col-md-6 col-sm-12">Add Item</div>
        <div className="col-md-6 col-sm-12">Sort</div>
      </div>
      {/* labels */}
      <div className="col-12">
        <LabelContainer
          addLabel={addLabel}
          reorderLabel={reorderLabel}
          isEditing={isEditing}
        >
          {labels.map((e: Label) => (
            <Label
              key={e.id}
              className={`label ${isEditing ? "can-delete" : ""}`}
              label={e}
              isEditing={isEditing}
              deleteLabel={deleteLabel}
            />
          ))}
        </LabelContainer>
      </div>
    </div>
  );
};

export default CatalogueItems;
