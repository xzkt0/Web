
const enToUaMap = {
    'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
    '[': 'х', ']': 'ї', 'a': 'ф', 's': 'і', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л',
    'l': 'д', ';': 'ж', "'": 'є', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь',
    ',': 'б', '.': 'ю', '/': '.'
};

const uaToEnMap = {
    'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p',
    'х': '[', 'ї': ']', 'ф': 'a', 'і': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k',
    'д': 'l', 'ж': ';', 'є': "'", 'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm',
    'б': ',', 'ю': '.'
};


function convertLayout(text, map) {
    return text.split('').map(char => map[char] || char).join('');
}


function replaceSelectedTextOnPage(convertedText) {
    const activeElement = document.activeElement;

    if (activeElement.tagName === 'TEXTAREA' || 
        (activeElement.tagName === 'INPUT' && 
        (activeElement.type === 'text' || activeElement.type === 'search'))) {
        
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;

        const textBefore = activeElement.value.substring(0, start);
        const textAfter = activeElement.value.substring(end);

        activeElement.value = textBefore + convertedText + textAfter;
        activeElement.selectionStart = activeElement.selectionEnd = start + convertedText.length;

        activeElement.focus();
    }
}


chrome.commands.onCommand.addListener((command) => {
    if (command === 'convert-text') {
        chrome.storage.local.get(['isEnabled', 'layout'], function(result) {
            if (result.isEnabled) {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    const tabId = tabs[0].id;

                 
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        func: () => window.getSelection().toString() 
                    }, (selectionResult) => {
                        if (chrome.runtime.lastError) {
                            console.error("Error executing script:", chrome.runtime.lastError.message);
                            alert("Скрипт не може бути виконаний на цій сторінці через політику безпеки.");
                            return;
                        }

                        const selectedText = selectionResult[0]?.result;

                        if (!selectedText) return; 

                        let convertedText;
                        if (result.layout === 'en-to-ua') {
                            convertedText = convertLayout(selectedText, enToUaMap);
                        } else {
                            convertedText = convertLayout(selectedText, uaToEnMap);
                        }

                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            func: replaceSelectedTextOnPage,
                            args: [convertedText]
                        });
                    });
                });
            }
        });
    }
});
