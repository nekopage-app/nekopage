declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			layout: DatabaseGetLayout | null,
			user: {
				id: number,
				username: string
			} | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
