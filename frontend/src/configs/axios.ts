import axios, {
	AxiosError,
	type AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
} from 'axios';
import { getCookie } from './cookies';

export interface ApiResponse<T = any> {
	data?: T;
	error?: string;
	success: boolean;
}

export interface RequestConfig {
	headers?: Record<string, string>;
	params?: Record<string, any>;
	timeout?: number;
	withCredentials?: boolean;
	data?: any;
}

export class ApiClient {
	private axiosInstance: AxiosInstance;
	private baseUrl: string;
	private endpointPrefix: string = '';

	constructor(config: AxiosRequestConfig = {}) {
		this.baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

		this.axiosInstance = axios.create({
			baseURL: this.baseUrl,
			headers: {
				'Content-Type': 'application/json',
				...config.headers,
			},
		});

		this.setupInterceptors();
	}

	public endpoint(url: string): ApiClient {
		const scopedClient = Object.create(this);
		scopedClient.endpointPrefix = url;
		return scopedClient;
	}

	private getFullUrl(url: string): string {
		return `${this.endpointPrefix}${url}`;
	}

	private setupInterceptors(): void {
		this.axiosInstance.interceptors.request.use(
			(config) => {
				const token = getCookie('access_token');
				if (token && config.headers)
					config.headers.Authorization = `Bearer ${token}`;
				return config;
			},
			(error) => Promise.reject(error)
		);

		this.axiosInstance.interceptors.response.use(
			(response: AxiosResponse) => response.data,
			(error: AxiosError) => {
				const errorMsg = (error?.response?.data as any)?.error;
				return Promise.reject(new Error(errorMsg));
			}
		);
	}

	/**
	 * Returns a GET request.
	 * @template T - Expected response data type
	 * @param url - The endpoint path
	 * @param config - Optional request configuration
	 * @returns A promise resolving to ApiResponse<T>
	 */
	async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
		return this.axiosInstance.get(this.getFullUrl(url), {
			...config,
		}) as unknown as Promise<ApiResponse<T>>;
	}

	/**
	 * Performs a POST request
	 * @template T - The shape of the 'data' field expected in the ApiResponse
	 * @param url - The endpoint path
	 * @param data - The body payload to send
	 * @param config - Optional request configuration
	 * @returns A promise resolving to ApiResponse<T>
	 */
	async post<T>(
		url: string,
		data?: any,
		config?: RequestConfig
	): Promise<ApiResponse<T>> {
		return this.axiosInstance.post(this.getFullUrl(url), data, {
			...config,
		}) as unknown as Promise<ApiResponse<T>>;
	}

	/**
	 * Performs a PUT request for full resource update.
	 * @template T - The shape of the 'data' field expected in the ApiResponse
	 * @param url - The endpoint path
	 * @param data - The body payload to send
	 * @param config - Optional request configuration
	 * @returns A promise resolving to ApiResponse<T>
	 */
	async put<T>(
		url: string,
		data?: any,
		config?: RequestConfig
	): Promise<ApiResponse<T>> {
		return this.axiosInstance.put(this.getFullUrl(url), data, {
			...config,
		}) as unknown as Promise<ApiResponse<T>>;
	}

	/**
	 * Performs a PATCH request for partial resource updates.
	 * @template T - The shape of the 'data' field expected in the ApiResponse.
	 * @param url - The endpoint path.
	 * @param data - The body payload to send.
	 * @param config - Optional configuration.
	 * @returns A promise resolving to ApiResponse<T>.
	 */
	async patch<T>(
		url: string,
		data?: any,
		config?: RequestConfig
	): Promise<ApiResponse<T>> {
		return this.axiosInstance.patch(this.getFullUrl(url), data, {
			...config,
		}) as unknown as Promise<ApiResponse<T>>;
	}

	/**
	 * Performs a DELETE request.
	 * @template T - The shape of the 'data' field expected in the ApiResponse.
	 * @param url - The endpoint path.
	 * @param config - Optional configuration.
	 * @returns A promise resolving to ApiResponse<T>.
	 */
	async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
		return this.axiosInstance.delete(this.getFullUrl(url), {
			...config,
		}) as unknown as Promise<ApiResponse<T>>;
	}
}

export const httpClient = new ApiClient();