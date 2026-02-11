import { ViewFilterOperand } from 'twenty-shared/types';

import { type FlatViewFilter } from 'src/engine/metadata-modules/flat-view-filter/types/flat-view-filter.type';
import {
  createStandardViewFilterFlatMetadata,
  type CreateStandardViewFilterArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-filter/create-standard-view-filter-flat-metadata.util';

export const computeStandardOpportunityViewFilters = (
  args: Omit<CreateStandardViewFilterArgs<'opportunity'>, 'context'>,
): Record<string, FlatViewFilter> => {
  return {
    myOpportunitiesOwnerIsMe: createStandardViewFilterFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'myOpportunities',
        viewFilterName: 'ownerIsMe',
        fieldName: 'owner',
        operand: ViewFilterOperand.IS,
        value: JSON.stringify({
          isCurrentWorkspaceMemberSelected: true,
          selectedRecordIds: [],
        }),
      },
    }),
  };
};
