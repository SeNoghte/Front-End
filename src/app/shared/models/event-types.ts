export interface EventDetail
{
    latitude?:number;
    longitude?:number;
    address?:string;
    cityId?:number;
    saveAddress?:boolean;
}

export interface City
{
    cityId:number;
    name: string;
    lat: number;
    lng:number;
}