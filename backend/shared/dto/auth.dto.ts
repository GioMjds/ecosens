import { IsEmail } from 'class-validator';
import { IsPasswordValid } from '../decorators/password.decorator';

export class AuthLoginDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsPasswordValid()
    password!: string;
}