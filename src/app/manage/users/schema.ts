import { InferSelectModel } from 'drizzle-orm';
import { users } from '~/db/schema/users';

export type SelectUser = InferSelectModel<typeof users>;
