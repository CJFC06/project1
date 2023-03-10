export class User {
    aboutYou: string;
    age: number;
    agreetc: boolean;
    dob: string;
    email: string;
    gender: string;
    address: Address;
    language: string;
    mobNumber: string
    name: string;
    password: string;
    // uploadPhoto: Image;
    uploadPhoto: string;
    role: string;
}

export class Address {
    id: number;
    addLine1: string;
    addLine2: string;
    city: string;
    state: string;
    zipCode: number;
}

export class Product {
    id: number;
    name: string;
    uploadPhoto: string;
    categoryID: number;
    qty: number;
    mrp: number;
    php: number;
    size: number;
    status: boolean;

}
export class Products {
    product: Product[]
}

export class Order {
    id: number;
    userId: number;
    sellerId: number;
    products: Product | Products;
    orderTotal: number
    deliveryAddress: Address;
    contact: number;
    dateTime: string;
}

export class Category {
    id: number
    name: string
}