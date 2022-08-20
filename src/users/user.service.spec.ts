import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.reposytory.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		const createdUser = await userService.createUser({
			email: 'adiv@gmail.com',
			name: 'Vadym',
			password: '1',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUserTrue - success', async () => {
		usersRepository.find = jest.fn().mockImplementationOnce(
			(email: string): UserModel => ({
				name: 'Vadym',
				email: email,
				password: '$2a$04$uCo4nNaStzkMH3AJIKPQe.B/dTPAE4ZXexZWhDsvNDfFXXN.vx76i',
				id: 1,
			}),
		);
		const validatedUser = await userService.validateUser({
			email: 'adiv@gmail.com',
			password: '1',
		});
		expect(validatedUser).toBeTruthy();
	});

	it('validateUserExistedFalse - wrong user', async () => {
		usersRepository.find = jest.fn().mockImplementationOnce((email: string): null => null);
		const validatedUser = await userService.validateUser({
			email: 'adiv@gmail.com',
			password: '1',
		});
		expect(validatedUser).toBeFalsy();
	});

	it('validateUserFalse - wrong password', async () => {
		usersRepository.find = jest.fn().mockImplementationOnce(
			(email: string): UserModel => ({
				name: 'Vadym',
				email: email,
				password: '$2a$04$uCo4nNaStzkMH3AJIKPQe.B/dTPAE4ZXexZWhDsvNDfFXXN.vx76i',
				id: 1,
			}),
		);
		const validatedUser = await userService.validateUser({
			email: 'adiv@gmail.com',
			password: '2',
		});
		expect(validatedUser).toBeFalsy();
	});
});
