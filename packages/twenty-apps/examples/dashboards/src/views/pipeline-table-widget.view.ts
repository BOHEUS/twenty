import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
  ViewVisibility,
} from 'twenty-sdk/define';

const opportunity = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity;

export const PIPELINE_TABLE_WIDGET_VIEW_UNIVERSAL_IDENTIFIER =
  '8b836c84-8036-4970-8a1e-3e36699ea860';

// A RECORD_TABLE widget needs its own view. It must be a *_WIDGET view type:
// plain TABLE/KANBAN/CALENDAR views leak into the record index view pickers.
// UNLISTED keeps it out of the view switcher entirely.
export default defineView({
  universalIdentifier: PIPELINE_TABLE_WIDGET_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Open pipeline (widget)',
  objectUniversalIdentifier: opportunity.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  visibility: ViewVisibility.UNLISTED,
  icon: 'IconTable',
  position: 0,
  fields: [
    {
      universalIdentifier: '7910a658-558d-4970-a335-4a79bd0354c9',
      fieldMetadataUniversalIdentifier:
        opportunity.fields.name.universalIdentifier,
      position: 0,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: '54df4074-3121-4b49-bf4e-b3f0f4310134',
      fieldMetadataUniversalIdentifier:
        opportunity.fields.stage.universalIdentifier,
      position: 1,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'b26cf8fd-1913-4932-910c-5b8fd5fa189b',
      fieldMetadataUniversalIdentifier:
        opportunity.fields.amount.universalIdentifier,
      position: 2,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '9c0b0536-c0f8-4205-996a-55c255d686c7',
      fieldMetadataUniversalIdentifier:
        opportunity.fields.closeDate.universalIdentifier,
      position: 3,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'c524bf62-5fd8-45e7-9de7-a3760323945c',
      fieldMetadataUniversalIdentifier:
        opportunity.fields.company.universalIdentifier,
      position: 4,
      isVisible: true,
      size: 160,
    },
  ],
  filters: [
    {
      universalIdentifier: '54f8b605-3278-4164-9f77-24fd6acc012a',
      fieldMetadataUniversalIdentifier:
        opportunity.fields.stage.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: ['WON', 'LOST'],
    },
  ],
  sorts: [
    {
      universalIdentifier: '9b0cc97b-4412-49de-8bd5-b64d7b7956e0',
      fieldMetadataUniversalIdentifier:
        opportunity.fields.closeDate.universalIdentifier,
      direction: ViewSortDirection.ASC,
    },
  ],
});
