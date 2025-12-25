import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';

type Otp = {
	code: string;
	expiresAt: Date;
	type: 'registration' | 'reset_password';
	firstName?: string;
	lastName?: string;
	hashedPassword?: string;
};

@Injectable()
export class EmailService {
	private otpCache = new Map<string, Otp>();
	private otpTTL = 10 * 60 * 1000;

	private mailTransport = nodemailer.createTransport({
		service: process.env.EMAIL_SERVICE,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	private otpKey(type: Otp['type'], email: string): string {
		return `${type}:${email.toLowerCase()}`;
	}

	storeOtp(
		type: Otp['type'],
		email: string,
		code: string,
		firstName?: string,
		lastName?: string,
		hashedPassword?: string
	) {
		const key = this.otpKey(type, email);
		const expiresAt = new Date(Date.now() + this.otpTTL);
		const rec: Otp = {
			code,
			expiresAt,
			type,
			firstName,
			lastName,
			hashedPassword,
		};
		this.otpCache.set(key, rec);
		const timeoutId = setTimeout(
			() => this.otpCache.delete(key),
			this.otpTTL + 1000
		);
		timeoutId.unref();
	}

	getOtpRecord(type: Otp['type'], email: string) {
		const key = this.otpKey(type, email);
		return this.otpCache.get(key);
	}

	deleteOtpRecord(type: Otp['type'], email: string) {
		const key = this.otpKey(type, email);
		this.otpCache.delete(key);
	}

	verifyOtp(type: Otp['type'], email: string, code: string) {
		const key = this.otpKey(type, email);
		const rec = this.otpCache.get(key);
		if (!rec) return false;

		if (rec.expiresAt.getTime() < Date.now()) {
			this.deleteOtpRecord(type, email);
			return false;
		}

		const ok = rec.code === code;
		if (ok) this.deleteOtpRecord(type, email);
		return ok;
	}

    async sendOtpEmail(
        email: string,
        code: string,
        purpose: 'registration' | 'reset_password'
    ) {
        const from = process.env.EMAIL_USER;

        let firstName: string = '';
        let lastName: string = '';

        if (purpose === 'registration') {
            const rec = this.getOtpRecord('registration', email);
            if (rec) {
                firstName = rec.firstName ?? '';
                lastName = rec.lastName ?? '';
            }
        }

        const greeting = firstName ? `Hello ${firstName} ${lastName},` : 'Hello,';
        const subject = purpose === 'registration' 
            ? 'Verify Your Registration - OTP Code'
            : 'Password Reset - OTP Code';

        const message = purpose === 'registration'
            ? `${greeting}\n\nThank you for registering with our Clinic Queue and Appointment System.\n\nYour verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nClinic Queue and Appointment System Team\n\n© ${new Date().getFullYear()} All rights reserved.`
            : `${greeting}\n\nWe received a request to reset your password.\n\nYour verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you did not request a password reset, please ignore this email or contact support if you have concerns.\n\nBest regards,\nClinic Queue and Appointment System Team\n\n© ${new Date().getFullYear()} All rights reserved.`;

        const mailOptions = {
            from: from,
            to: email,
            subject: subject,
            text: message,
        };

        try {
            await this.mailTransport.sendMail(mailOptions);
        } catch (error) {
            throw new Error(`Failed to send verification email`);
        }
    }

    generateOtp(): string {
        return String(randomInt(100000, 999999));
    }
}