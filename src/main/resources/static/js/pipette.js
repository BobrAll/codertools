const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const colorResult = document.getElementById("result");

let colorCounter = 0;

init()

function init() {
    const img = new Image();
    img.src = '/img/pipette_demo.jpg';
    img.onload = function () {draw_image(img)}
}

function getPixelAtPosition(x, y) {
    let rect = canvas.getBoundingClientRect();
    const coef = canvas.width / rect.width;

    return ctx.getImageData((x - rect.left) * coef, (y - rect.top) * coef, 1, 1).data;
}

imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();

        img.onload = function() {draw_image(img)};
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

canvas.addEventListener('click', function(event) {
    const x = event.clientX;
    const y = event.clientY;

    const pixel = getPixelAtPosition(x, y);

    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const rgb = `rgb(${r}, ${g}, ${b})`;

    colorResult.innerHTML += `
            <th scope="row">${++colorCounter}</th>
            <td><div class="color_demo border-black border" style="background-color: ${rgb}"></div></td>
            <td>${rgb}</td>
            <td>${rgbToHex(r, g, b)}</td>
            <td>${rgbToCmyk(r, g, b)}</td>
            `
});

function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

function rgbToCmyk(r, g, b) {
    let c = 1 - r / 255, m = 1 - g / 255, y = 1 - b / 255, k = Math.min(c, Math.min(m, y));

    c = Math.round((c - k) / (1 - k) * 100);
    m = Math.round((m - k) / (1 - k) * 100);
    y = Math.round((y - k) / (1 - k) * 100);

    return `CMYK(${c}%, ${m}%, ${y}%, ${Math.round(k * 100)}%)`;
}

function draw_image(img) {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
}