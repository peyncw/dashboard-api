import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'a@a.ru', password: '1' });
		expect(res.statusCode).toBe(422);
	});

	it('Login - sucsess', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'adin222@a.ua', password: 'asdsada' });
		expect(res.statusCode).toBe(200);
		expect('jwt' in res.body).toBeTruthy();
		// expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - failed', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'adin2224@a.ua', password: 'asdsada' });
		expect(res.statusCode).toBe(401);
	});
	it('Info - sucsess JWT', async () => {
		const res = await request(application.app).get('/users/info').set({
			Authorization:
				'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkaW4yMjJAYS51YSIsImlhdCI6MTY2MDUxMTY1NX0.DrxvrgeHX9hZrNCO1nl60c2_cmZOQ-z0UpqVsdTvLw0',
		});
		expect(res.statusCode).toBe(200);
		expect(res.body.email).toEqual('adin222@a.ua');
		expect(res.body.id).toEqual(6);
	});
	it('Info - sucsess LOGIN', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'adin222@a.ua', password: 'asdsada' });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.email).toEqual('adin222@a.ua');
		expect(res.body.id).toEqual(6);
	});
	it('Info - failed', async () => {
		const res = await request(application.app).get('/users/info').set({
			Authorization:
				'Bearer uyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkaW4yMjJAYS51YSIsImlhdCI6MTY2MDUxMTY1NX0.DrxvrgeHX9hZrNCO1nl60c2_cmZOQ-z0UpqVsdTvLw0',
		});
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
