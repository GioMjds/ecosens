import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
	constructor() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
	}

	async uploadImage(file: Express.Multer.File): Promise<any> {
		return new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{ resource_type: 'image' },
					(error, result) => {
					if (error) return reject(error);
					resolve(result);
				})
				.end(file.buffer);
		});
	}

	async uploadVideo(file: Express.Multer.File): Promise<any> {
		return new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{ resource_type: 'video' },
					(error, result) => {
						if (error) return reject(error);
						resolve(result);
					}
				)
				.end(file.buffer);
		});
	}

	async deleteImage(publicId: string): Promise<any> {
		return cloudinary.uploader.destroy(publicId, { 
			resource_type: 'image' 
		});
	}

	async deleteVideo(publicId: string): Promise<any> {
		return cloudinary.uploader.destroy(publicId, {
			resource_type: 'video',
		});
	}

	getCloudinary() {
		return cloudinary;
	}
}