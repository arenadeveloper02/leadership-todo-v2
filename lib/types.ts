export type TodoAction = 'list' | 'add' | 'update' | 'delete';

export interface TodoApiRequest {
  action: TodoAction;
  rowId?: string;
  data?: Record<string, unknown>;
}

export interface TodoTask {
  id: string;
  task: string;
  owner: string;
  entryDate: string;
  dueDate: string;
  done: boolean;
  completedDate: string;
  comment: string;
}

export type Urgency = 'overdue' | 'soon' | 'week' | 'later' | 'done';

export type TabId = 'tasks' | 'add' | 'done' | 'stats';

export interface TodoStats {
  total: number;
  open: number;
  completed: number;
  overdue: number;
  dueWithin7: number;
}
