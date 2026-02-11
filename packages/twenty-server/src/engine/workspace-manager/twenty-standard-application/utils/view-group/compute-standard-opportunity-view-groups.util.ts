import { type FlatViewGroup } from 'src/engine/metadata-modules/flat-view-group/types/flat-view-group.type';
import {
  createStandardViewGroupFlatMetadata,
  type CreateStandardViewGroupArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-group/create-standard-view-group-flat-metadata.util';

export const computeStandardOpportunityViewGroups = (
  args: Omit<CreateStandardViewGroupArgs<'opportunity'>, 'context'>,
): Record<string, FlatViewGroup> => {
  return {
    // byStage view groups
    byStageNew: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'new',
        isVisible: true,
        fieldValue: 'NEW',
        position: 0,
      },
    }),
    byStageScreening: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'screening',
        isVisible: true,
        fieldValue: 'SCREENING',
        position: 1,
      },
    }),
    byStageMeeting: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'meeting',
        isVisible: true,
        fieldValue: 'MEETING',
        position: 2,
      },
    }),
    byStageProposal: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'proposal',
        isVisible: true,
        fieldValue: 'PROPOSAL',
        position: 3,
      },
    }),
    byStageCustomer: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'customer',
        isVisible: true,
        fieldValue: 'CUSTOMER',
        position: 4,
      },
    }),

    // myOpportunities view groups
    myOpportunitiesNew: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'myOpportunities',
        viewGroupName: 'new',
        isVisible: true,
        fieldValue: 'NEW',
        position: 0,
      },
    }),
    myOpportunitiesScreening: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'myOpportunities',
        viewGroupName: 'screening',
        isVisible: true,
        fieldValue: 'SCREENING',
        position: 1,
      },
    }),
    myOpportunitiesMeeting: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'myOpportunities',
        viewGroupName: 'meeting',
        isVisible: true,
        fieldValue: 'MEETING',
        position: 2,
      },
    }),
    myOpportunitiesProposal: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'myOpportunities',
        viewGroupName: 'proposal',
        isVisible: true,
        fieldValue: 'PROPOSAL',
        position: 3,
      },
    }),
    myOpportunitiesCustomer: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'myOpportunities',
        viewGroupName: 'customer',
        isVisible: true,
        fieldValue: 'CUSTOMER',
        position: 4,
      },
    }),
  };
};
