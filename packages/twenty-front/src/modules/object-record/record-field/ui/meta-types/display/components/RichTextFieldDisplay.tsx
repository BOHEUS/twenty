import { getActivitySummary } from '@/activities/utils/getActivitySummary';
import { useRichTextFieldDisplay } from '@/object-record/record-field/ui/meta-types/hooks/useRichTextFieldDisplay';

export const RichTextFieldDisplay = () => {
  const { fieldValue } = useRichTextFieldDisplay();

  return (
    <div>
      <span>{getActivitySummary(fieldValue)}</span>
    </div>
  );
};
