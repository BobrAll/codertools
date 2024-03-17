const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const colorResult = document.getElementById("result");

var colorCounter = 0;

function getPixelAtPosition(x, y) {
    rect = canvas.getBoundingClientRect();
    let coef = canvas.width / rect.width;
    return ctx.getImageData((x - rect.left) * coef, (y - rect.top) * coef, 1, 1).data;
}

imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const image = new Image();

        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;

            ctx.drawImage(image, 0, 0);
        };

        image.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

canvas.addEventListener('click', function(event) {
    const x = event.clientX;
    const y = event.clientY;

    const pixel = getPixelAtPosition(x, y);

    var r = pixel[0];
    var g = pixel[1];
    var b = pixel[2];
    var rgb = `rgb(${r}, ${g}, ${b})`;
    // colorInfo.style.backgroundColor = color;


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
    var c = 1 - r / 255, m = 1 - g / 255, y = 1 - b / 255, k = Math.min(c, Math.min(m, y));

    c = Math.round((c - k) / (1 - k) * 100);
    m = Math.round((m - k) / (1 - k) * 100);
    y = Math.round((y - k) / (1 - k) * 100);

    return `CMYK(${c}%, ${m}%, ${y}%, ${Math.round(k * 100)}%)`;
}
