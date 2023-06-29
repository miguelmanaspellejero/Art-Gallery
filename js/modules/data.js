class Artwork {
    constructor(id, image, title, artist, date) {
        this.image = image;
        this.title = title;
        this.artist = artist;
        this.date = date;
    }
    static fromObject(obj) {
        return new Artwork(obj.img, obj.title, obj.artist, obj.date);
    }
}
