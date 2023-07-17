function chooseRandomBackground() {
    const backgroundUrls = [
        "https://images.metmuseum.org/CRDImages/ep/original/DT1567.jpg",
        "https://images.metmuseum.org/CRDImages/ad/original/DT4564.jpg",
        "https://images.metmuseum.org/CRDImages/ad/original/ap87.8.8.jpg",
        "https://images.metmuseum.org/CRDImages/ep/original/DT1859.jpg",
        "https://images.metmuseum.org/CRDImages/ad/original/DT1545.jpg",
    ];

    const randomImage =
        backgroundUrls[Math.floor(Math.random() * backgroundUrls.length)];

    document.querySelector(
        ".background-image"
    ).style.backgroundImage = `url(${randomImage})`;
}

chooseRandomBackground();
