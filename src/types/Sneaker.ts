import type { Size } from './Size';

export type Log = {
    _id: string;
    step: 'created' | 'cart' | 'purchase';
    response: any;
    created_at: Date;
};

export type Sneaker = {
    _id: string;
    name: string;
    release_date: Date;
    price: number;
    image: string;
    url: string;
    selected_size: Size;
    checkout_in_progress: boolean;
    logs: Array<Log>;
    created_at: Date;
    updated_at: Date;
};
