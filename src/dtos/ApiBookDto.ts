export default interface ApiBookDto {
    bookId?: number;
    title?: string;
    originalTitle?: string;
    publicationYear?: number;
    isVisible?: number;
    language?: string;
    pages?: number;
    isbn?: string;
    catalogNumber?: string;
    publisherId?: number;
    locationId?: number;     
    imageFront?: string;
    imageBack?: string;
    
    category?: {
        categoryId: number;
        name: string;
    };
    authors?: {
        authorId: number;
        forename: string;
        surname: string;
    }[];
    photos: {
        photoId: number;
        imagePath: string;
    }[];
    categoryBook?: {
        name: string;
    };
    location?: {
        room: string;
        shelf: string;
    }
    publisher?: {
        name: string;
    }
}