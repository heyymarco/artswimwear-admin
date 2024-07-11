import {
    type Model,
} from '@/libs/types'



export const selectId = <TModel extends Model>(model: TModel) => model.id;
