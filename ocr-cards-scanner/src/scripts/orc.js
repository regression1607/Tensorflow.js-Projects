import Tesseract from 'tesseract.js';

export async function extractTextFromImage(imageElement) {
    console.log('Starting text extraction with Tesseract.js.');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    context.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);

    const dataUrl = canvas.toDataURL('image/png');
    console.log('Data URL generated:', dataUrl);

    const { data: { text } } = await Tesseract.recognize(dataUrl, 'eng', {
        logger: m => console.log(m)
    });

    console.log('Text extracted:', text);
    return text;
}
