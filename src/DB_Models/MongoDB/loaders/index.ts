import DataLoader from 'dataloader'

import models from '..'
import { batchUsers } from './user'

/* In where, we need to load the parent data we put the loaders neither as usual ORM */

export const userLoader = new DataLoader((keys: string[]) => batchUsers(keys, models), {
	cache: false,
})
