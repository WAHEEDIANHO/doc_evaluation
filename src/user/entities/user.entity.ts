import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema() 
export class User {
  
  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String, unique: true })
  username: string;
  
  @Prop({ required: true, type: String })
  password: string;
  
  @Prop({ type: Boolean, default: false })
  isAdmin: boolean
}


export const UserSchema = SchemaFactory.createForClass(User);


