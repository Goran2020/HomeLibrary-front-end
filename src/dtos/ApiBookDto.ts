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
        bookId: number;
        cover: string;
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