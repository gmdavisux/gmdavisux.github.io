const overlayState = { images: [], currentIndex: 0 };

export function initOverlay() {
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    const overlay = document.getElementById('overlay');
    const overlayImg = document.getElementById('overlay-img');

    function closeOverlay() {
        overlay.style.display = 'none';
        header.classList.remove('hide-header');
        footer.classList.remove('hide-footer');
    }

    function showImage(index) {
        overlayState.currentIndex = index;
        overlayImg.src = overlayState.images[index].src;
        overlay.style.display = 'flex';
        header.classList.add('hide-header');
        footer.classList.add('hide-footer');
    }

    document.getElementById('prev').addEventListener('click', function () {
        if (overlayState.currentIndex > 0) {
            showImage(overlayState.currentIndex - 1);
        } else {
            closeOverlay();
        }
    });

    document.getElementById('next').addEventListener('click', function () {
        if (overlayState.currentIndex < overlayState.images.length - 1) {
            showImage(overlayState.currentIndex + 1);
        } else {
            closeOverlay();
        }
    });

    document.getElementById('close').addEventListener('click', closeOverlay);

    overlay.addEventListener('click', function (e) {
        if (e.target.id === 'overlay') {
            closeOverlay();
        }
    });

    return showImage;
}

export function wirePageImages(specialContent, showImage, currentPage) {
    if (currentPage === 'about' || currentPage === 'reco') {
        return;
    }

    const regex = /^https:\/\/usersimple\.files\.wordpress\.com\/\d+\/\d+/;
    const images = specialContent.querySelectorAll('img');
    overlayState.images = Array.from(images);

    images.forEach((image, index) => {
        const currentSrc = image.src;

        if (regex.test(currentSrc)) {
            image.src = currentSrc.replace(regex, 'images');
        }

        image.addEventListener('click', function () {
            showImage(index);
        });
    });
}