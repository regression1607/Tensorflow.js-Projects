export function extractCreditCardInfo(text) {
    console.log('Extracting credit card info from text:', text);

    const cardNumberRegex = /\b(?:\d[ -]*?){13,16}\b/;
    const expiryDateRegex = /\b(?:0[1-9]|1[0-2])\/(?:[0-9]{2}|[0-9]{4})\b/;
    const nameRegex = /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/; // Simplified name regex

    const cardNumberMatch = text.match(cardNumberRegex);
    const expiryDateMatch = text.match(expiryDateRegex);
    const nameMatch = text.match(nameRegex);

    const cardNumber = cardNumberMatch ? cardNumberMatch[0].replace(/\s+/g, '') : null;
    const expiryDate = expiryDateMatch ? expiryDateMatch[0] : null;
    const name = nameMatch ? nameMatch[0] : null;

    if (cardNumber && expiryDate && name) {
        return {
            name,
            cardNumber,
            expiryDate
        };
    }
    return null;
}
