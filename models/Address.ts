import { Schema, InferSchemaType } from 'mongoose'



export const addressSchema = new Schema({
    firstName : { type: String , required: true  , minLength: 2 , maxLength: 30 },
    lastName  : { type: String , required: true  , minLength: 1 , maxLength: 30 },
    
    phone     : { type: String , required: true  , minLength: 5 , maxLength: 15 },
    
    address   : { type: String , required: true  , minLength: 5 , maxLength: 90 },
    city      : { type: String , required: true  , minLength: 3 , maxLength: 50 },
    zone      : { type: String , required: true  , minLength: 3 , maxLength: 50 },
    zip       : { type: String , required: false , minLength: 2 , maxLength: 11 },
    country   : { type: String , required: true  , minLength: 2 , maxLength:  3 },
});
export type AddressSchema = InferSchemaType<typeof addressSchema>;