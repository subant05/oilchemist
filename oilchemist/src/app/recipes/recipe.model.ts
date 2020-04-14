export interface Recipe {
    id?: string;
    name:string;
    searchableName?:string;
    description:string;
    searchableDescription: string;
    oils:{name:string, brand:string}[];
    uses:{
        topical:boolean,
        aromatic:boolean,
        internal:boolean
    };
    imageUrl:string;
    creator:string;
    created: string;
    modified?: string;
}

