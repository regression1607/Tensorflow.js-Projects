export function showText(text) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    if (text) {
        const textElement = document.createElement('p');
        textElement.textContent = text;
        resultDiv.appendChild(textElement);
    } else {
        resultDiv.textContent = 'No text found in the image.';
    }
}

export function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = `Error: ${message}`;
}

export function showLoading() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Processing image...';
}
