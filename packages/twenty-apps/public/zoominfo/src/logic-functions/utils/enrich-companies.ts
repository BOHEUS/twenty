import { COMPANY_OUTPUT_FIELDS } from 'src/constants/company-output-fields';
import { ZOOMINFO_COMPANY_ENRICH_PATH } from 'src/constants/zoominfo-company-enrich-path';
import { postZoomInfoEnrich } from 'src/logic-functions/utils/post-zoominfo-enrich';
import { type ZoomInfoCompanyData } from 'src/types/zoominfo-company-data';
import { type ZoomInfoCompanyMatchInput } from 'src/types/zoominfo-company-match-input';
import { type ZoomInfoEnrichResult } from 'src/types/zoominfo-enrich-result';

export const enrichCompanies = (
  matchInputs: ZoomInfoCompanyMatchInput[],
): Promise<ZoomInfoEnrichResult<ZoomInfoCompanyData>[]> =>
  postZoomInfoEnrich<ZoomInfoCompanyData, ZoomInfoCompanyMatchInput>({
    path: ZOOMINFO_COMPANY_ENRICH_PATH,
    resourceType: 'CompanyEnrich',
    matchInputKey: 'matchCompanyInput',
    matchInputs,
    outputFields: COMPANY_OUTPUT_FIELDS,
  });
