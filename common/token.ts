export interface Token {
    address: string;
    name: string;
    img: { src: string, format: string};
    artist: string;
    isApply: boolean;
    owners: { address: string, quantity: number }[];
}