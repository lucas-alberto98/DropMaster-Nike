export type Size = {
    nike_id: string;
    name: string;
    stock: number;
};

export type Sneaker = {
    name: string;
    release_date?: Date;
    price?: number;
    image: string;
    url: string;
    sizes?: Array<Size>;
    store: 'nike' | 'artwalk';
};
