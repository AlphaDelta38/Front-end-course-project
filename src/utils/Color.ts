export function generateRandomColorWithCross() {
    let r, g, b, luminance;

    do {
        r = Math.floor(Math.random() * 256);
        g = Math.floor(Math.random() * 256);
        b = Math.floor(Math.random() * 256);

        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;

        const rL = rNorm <= 0.03928 ? rNorm / 12.92 : Math.pow((rNorm + 0.055) / 1.055, 2.4);
        const gL = gNorm <= 0.03928 ? gNorm / 12.92 : Math.pow((gNorm + 0.055) / 1.055, 2.4);
        const bL = bNorm <= 0.03928 ? bNorm / 12.92 : Math.pow((bNorm + 0.055) / 1.055, 2.4);

        luminance = 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
    } while (luminance > 0.5);

    return `rgb(${r}, ${g}, ${b})`;
}