document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');
    
    chrome.storage.local.get(['isEnabled', 'layout'], function(result) {
        if (result.isEnabled) {
            toggleBtn.textContent = 'Disable';
        } else {
            toggleBtn.textContent = 'Enable';
        }

        document.getElementById('layout-select').value = result.layout || 'en-to-ua';
    });

    toggleBtn.addEventListener('click', () => {
        chrome.storage.local.get(['isEnabled'], function(result) {
            const isEnabled = !result.isEnabled;
            chrome.storage.local.set({ isEnabled: isEnabled }, function() {
                toggleBtn.textContent = isEnabled ? 'Disable' : 'Enable';
            });
        });
    });

    document.getElementById('layout-select').addEventListener('change', (event) => {
        chrome.storage.local.set({ layout: event.target.value });
    });
});
