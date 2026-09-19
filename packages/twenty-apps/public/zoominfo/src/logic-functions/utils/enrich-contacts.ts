import { CONTACT_OUTPUT_FIELDS } from 'src/constants/contact-output-fields';
import { ZOOMINFO_CONTACT_ENRICH_PATH } from 'src/constants/zoominfo-contact-enrich-path';
import { postZoomInfoEnrich } from 'src/logic-functions/utils/post-zoominfo-enrich';
import { type ZoomInfoContactData } from 'src/types/zoominfo-contact-data';
import { type ZoomInfoContactMatchInput } from 'src/types/zoominfo-contact-match-input';
import { type ZoomInfoEnrichResult } from 'src/types/zoominfo-enrich-result';

export const enrichContacts = (
  matchInputs: ZoomInfoContactMatchInput[],
): Promise<ZoomInfoEnrichResult<ZoomInfoContactData>[]> =>
  postZoomInfoEnrich<ZoomInfoContactData, ZoomInfoContactMatchInput>({
    path: ZOOMINFO_CONTACT_ENRICH_PATH,
    resourceType: 'ContactEnrich',
    matchInputKey: 'matchPersonInput',
    matchInputs,
    outputFields: CONTACT_OUTPUT_FIELDS,
  });
