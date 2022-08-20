import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'The email is wrong' })
	email: string;
	@IsString({ message: 'The password is wrong or empty' })
	password: string;
	@IsString({ message: 'The name is empty' })
	name: string;
}
