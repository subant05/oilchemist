export interface Recipe {
    id?: string;
    name:string;
    description:string;
    oils:{name:string, brand:string}[];
    uses:{
        topical:boolean,
        aromatic:boolean,
        internal:boolean
    };
    imageUrl:string;
    creator:string;
}

