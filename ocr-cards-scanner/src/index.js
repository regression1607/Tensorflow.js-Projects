import { extractTextFromImage } from './scripts/orc';
import { showText, showError, showLoading } from './scripts/display';
import { saveToExcel } from './scripts/excel';

let selectedOption = '';

document.getElementById('options').addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        selectedOption = event.target.id;
        document.getElementById('upload').click();
    }
});

document.getElementById('upload').addEventListener('change', async (event) => {
    console.log('Uploading image...');
    const file = event.target.files[0];
    if (!file) {
        alert('Please upload an image file.');
        return;
    }

    const imageElement = document.createElement('img');
    imageElement.src = URL.createObjectURL(file);
    imageElement.style.width = '500px'; // Set width for better display
    imageElement.style.height = 'auto'; // Maintain aspect ratio

    // Display the image before processing
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results
    resultDiv.appendChild(imageElement);

    // Wait for the image to load before processing
    imageElement.onload = async () => {
        try {
            showLoading();
            console.log('Image loaded.');
            const text = await extractTextFromImage(imageElement);
            showText(text);

            if (selectedOption === 'ocr-creditCard-scan') {
                const { extractCreditCardInfo } = await import('./scripts/creditCard');
                const creditCardInfo = extractCreditCardInfo(text);
                if (creditCardInfo) {
                    saveToExcel(creditCardInfo);
                } else {
                    showError('No credit card information found.');
                }
            }
        } catch (error) {
            console.error('Error processing the image:', error);
            showError('Error processing the image.');
        }
    };
});
