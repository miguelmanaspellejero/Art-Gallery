export class Artwork {
    constructor(
        id,
        image,
        imageLarge,
        title,
        artist,
        artistSort,
        artistBio,
        date,
        dateSort,
        highlight,
        department,
        medium,
        dimensions
    ) {
        this.id = id;
        this.image = image;
        this.imageLarge = imageLarge;
        this.title = title;
        this.artist = artist;
        this.artistSort = artistSort;
        this.artistBio = artistBio;
        this.date = date;
        this.dateSort = dateSort;
        this.highlight = highlight;
        this.department = department;
        this.medium = medium;
        this.dimensions = dimensions;
    }

    /* Add support for fetching other APIs:
    static fromObject(obj) {
        return new Artwork(
            obj.id,
            obj.image,
            obj.imageLarge,
            obj.title,
            obj.artist,
            obj.artistSort,
            obj.artistBio,
            obj.date,
            obj.dateSort,
            obj.highlight,
            obj.department,
            obj.medium,
            obj.dimensions
        );
    }*/
}
