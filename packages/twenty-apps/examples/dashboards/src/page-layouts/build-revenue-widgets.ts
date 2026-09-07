import {
  AggregateOperations,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  type PageLayoutWidgetManifest,
} from 'twenty-sdk/define';
import { PIPELINE_TABLE_WIDGET_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/pipeline-table-widget.view';

const opportunity = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity;
const company = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company;

// Chart-config values the SDK does not export as enums, so they travel as
// string literals through the manifest.
const CHART_DEFAULTS = {
  timezone: 'UTC',
  firstDayOfTheWeek: 1,
} as const;

const BAR_DEFAULTS = {
  ...CHART_DEFAULTS,
  layout: 'VERTICAL',
  axisNameDisplay: 'NONE',
  color: 'auto',
} as const;

export type RevenueWidgetUniversalIdentifiers = {
  pipelineValue: string;
  openDealCount: string;
  companyCount: string;
  pipelineByStage: string;
  companiesByAccountOwner: string;
  pipelineTable: string;
};

// Both page layouts render the exact same widgets; only the parent layout type
// differs. Widget universal identifiers must stay unique across the app, so
// each layout passes its own set in.
export const buildRevenueWidgets = (
  universalIdentifiers: RevenueWidgetUniversalIdentifiers,
): PageLayoutWidgetManifest[] => [
  {
    universalIdentifier: universalIdentifiers.pipelineValue,
    title: 'Pipeline value',
    type: 'GRAPH',
    objectUniversalIdentifier: opportunity.universalIdentifier,
    position: {
      layoutMode: PageLayoutTabLayoutMode.GRID,
      row: 0,
      column: 0,
      rowSpan: 2,
      columnSpan: 4,
    },
    configuration: {
      configurationType: 'AGGREGATE_CHART',
      aggregateFieldMetadataUniversalIdentifier:
        opportunity.fields.amount.universalIdentifier,
      aggregateOperation: AggregateOperations.SUM,
      displayDataLabel: true,
      ...CHART_DEFAULTS,
    },
  },
  {
    universalIdentifier: universalIdentifiers.openDealCount,
    title: 'Open deals',
    type: 'GRAPH',
    objectUniversalIdentifier: opportunity.universalIdentifier,
    position: {
      layoutMode: PageLayoutTabLayoutMode.GRID,
      row: 0,
      column: 4,
      rowSpan: 2,
      columnSpan: 4,
    },
    configuration: {
      configurationType: 'AGGREGATE_CHART',
      aggregateFieldMetadataUniversalIdentifier:
        opportunity.fields.name.universalIdentifier,
      aggregateOperation: AggregateOperations.COUNT,
      displayDataLabel: true,
      ...CHART_DEFAULTS,
      filter: {
        recordFilters: [
          {
            fieldMetadataUniversalIdentifier:
              opportunity.fields.stage.universalIdentifier,
            operand: 'IS_NOT',
            value: '["WON","LOST"]',
          },
        ],
      },
    },
  },
  {
    universalIdentifier: universalIdentifiers.companyCount,
    title: 'Companies',
    type: 'GRAPH',
    objectUniversalIdentifier: company.universalIdentifier,
    position: {
      layoutMode: PageLayoutTabLayoutMode.GRID,
      row: 0,
      column: 8,
      rowSpan: 2,
      columnSpan: 4,
    },
    configuration: {
      configurationType: 'AGGREGATE_CHART',
      aggregateFieldMetadataUniversalIdentifier:
        company.fields.name.universalIdentifier,
      aggregateOperation: AggregateOperations.COUNT,
      displayDataLabel: true,
      ...CHART_DEFAULTS,
    },
  },
  {
    universalIdentifier: universalIdentifiers.pipelineByStage,
    title: 'Pipeline by stage',
    type: 'GRAPH',
    objectUniversalIdentifier: opportunity.universalIdentifier,
    position: {
      layoutMode: PageLayoutTabLayoutMode.GRID,
      row: 2,
      column: 0,
      rowSpan: 5,
      columnSpan: 6,
    },
    configuration: {
      configurationType: 'BAR_CHART',
      aggregateFieldMetadataUniversalIdentifier:
        opportunity.fields.amount.universalIdentifier,
      aggregateOperation: AggregateOperations.SUM,
      primaryAxisGroupByFieldMetadataUniversalIdentifier:
        opportunity.fields.stage.universalIdentifier,
      primaryAxisOrderBy: 'FIELD_ASC',
      displayLegend: false,
      ...BAR_DEFAULTS,
    },
  },
  {
    universalIdentifier: universalIdentifiers.companiesByAccountOwner,
    title: 'Companies by account owner',
    type: 'GRAPH',
    objectUniversalIdentifier: company.universalIdentifier,
    position: {
      layoutMode: PageLayoutTabLayoutMode.GRID,
      row: 2,
      column: 6,
      rowSpan: 5,
      columnSpan: 6,
    },
    configuration: {
      configurationType: 'PIE_CHART',
      aggregateFieldMetadataUniversalIdentifier:
        company.fields.name.universalIdentifier,
      aggregateOperation: AggregateOperations.COUNT,
      groupByFieldMetadataUniversalIdentifier:
        company.fields.accountOwner.universalIdentifier,
      orderBy: 'VALUE_DESC',
      displayLegend: true,
      ...CHART_DEFAULTS,
    },
  },
  {
    universalIdentifier: universalIdentifiers.pipelineTable,
    title: 'Open pipeline',
    type: 'RECORD_TABLE',
    objectUniversalIdentifier: opportunity.universalIdentifier,
    position: {
      layoutMode: PageLayoutTabLayoutMode.GRID,
      row: 7,
      column: 0,
      rowSpan: 8,
      columnSpan: 12,
    },
    configuration: {
      configurationType: 'RECORD_TABLE',
      viewUniversalIdentifier: PIPELINE_TABLE_WIDGET_VIEW_UNIVERSAL_IDENTIFIER,
    },
  },
];
