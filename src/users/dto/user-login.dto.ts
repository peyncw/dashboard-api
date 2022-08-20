import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'The email is wrong' })
	email: string;
	@IsString({ message: 'The password is wrong or empty' })
	password: string;
}
