export class Artwork {
    constructor(
        id,
        image,
        title,
        artist,
        artistSort,
        date,
        dateSort,
        highlight
    ) {
        this.id = id;
        this.image = image;
        this.title = title;
        this.artist = artist;
        this.artistSort = artistSort;
        this.date = date;
        this.dateSort = dateSort;
        this.highlight = this.highlight;
    }
    /*
    // Add support for fetching other APIs:
    static fromObject(obj) {
        return new Artwork(obj.id,obj.image, obj.title, obj.artist, obj.artistSort, obj.date, obj.dateSort);
    }    
    */
}
