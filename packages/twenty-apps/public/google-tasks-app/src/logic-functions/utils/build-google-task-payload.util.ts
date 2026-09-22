import {
  type GoogleTaskPayload,
  type TaskNode,
} from 'src/logic-functions/types/types';
import { toGoogleDueDate } from 'src/logic-functions/utils/normalize-due-date.util';

export const buildGoogleTaskPayload = (task: TaskNode): GoogleTaskPayload => ({
  title: task.title ?? '',
  notes: task.bodyV2?.markdown ?? '',
  due: toGoogleDueDate(task.dueAt),
  status: task.status === 'DONE' ? 'completed' : 'needsAction',
});
