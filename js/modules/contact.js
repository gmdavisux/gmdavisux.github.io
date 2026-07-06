export function updateContactInfo() {
    const liElements = document.querySelectorAll('.dropdown-menu .dropdown-item');
    const email = ['&#103;&#97;&#114;&#121;&#46;&#100;&#97;&#118;&#105;&#115;', '&#64;', '&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;'];
    const phone = ['&#53;&#56;&#53;', '&#45;', '&#51;&#48;&#49;', '&#45;', '&#48;&#52;&#54;&#55;'];

    function decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    liElements[0].innerHTML = phone.join('');
    liElements[1].innerHTML = email.join('');

    liElements[0].addEventListener('click', function (e) {
        e.preventDefault();
        const tempLink = document.createElement('a');
        tempLink.href = 'tel:' + decodeHtml(phone.join(''));
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    });

    liElements[1].addEventListener('click', function (e) {
        e.preventDefault();
        const tempLink = document.createElement('a');
        tempLink.href = 'mailto:' + decodeHtml(email.join(''));
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    });
}