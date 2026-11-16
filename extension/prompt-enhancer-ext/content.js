console.log("AI Prompt Enhancer loaded");

/**
 * STEP 1: CREATE THE ENHANCE BUTTON
 * This creates a button styled to match ChatGPT's UI
 */
function createEnhanceButton() {
    const button = document.createElement('button');
    
    // Styling to match ChatGPT's dark theme
    button.style.cssText = `
        width: 36px;
        height: 36px;
        background-color: #000000;
        color: white;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-right: 8px;
        transition: all 0.2s ease;
        padding: 0;
        flex-shrink: 0;
    `;
    
    button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
    `;
    
    button.setAttribute('title', 'Enhance prompt with AI');
    button.setAttribute('type', 'button'); // Prevent form submission
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#333333';
        button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#000000';
        button.style.transform = 'scale(1)';
    });
    
    return button;
}

/**
 * STEP 2: GET THE USER'S TYPED PROMPT
 * Reads the current content from ChatGPT's input textarea
 */
function getUserPrompt() {
    // ChatGPT uses a contenteditable div for input
    const selectors = [
        '#prompt-textarea',
        '[contenteditable="true"]',
        'textarea',
        '[data-id="root"]'
    ];
    
    for (const selector of selectors) {
        const inputField = document.querySelector(selector);
        if (inputField) {
            // Get text content, handling both textarea and contenteditable
            const text = inputField.value || inputField.textContent || inputField.innerText;
            return text.trim();
        }
    }
    
    console.warn("Could not find ChatGPT input field");
    return '';
}

/**
 * STEP 3: FIND WHERE TO INJECT THE BUTTON
 * FIX: We now strictly anchor to the text area itself, completely ignoring 
 * generic flex classes so it NEVER accidentally targets the top header.
 */
function findInputContainer() {
    const textarea = document.querySelector('#prompt-textarea') || 
                     document.querySelector('[contenteditable="true"]');
                     
    if (textarea) {
        // Return the form containing the textarea
        return textarea.closest('form') || textarea.parentElement;
    }
    
    return null;
}

/**
 * STEP 4: INJECT THE ENHANCE BUTTON
 * Places the button in the ChatGPT interface
 */
function injectEnhanceButton() {
    const container = findInputContainer();
    
    if (!container) {
        return;
    }

    // FIX: Smart duplicate check. If the button exists but flew to the header, 
    // this removes the rogue button and safely re-injects it in the bottom bar.
    const existingButton = document.querySelector('.ai-enhance-button');
    if (existingButton) {
        if (container.contains(existingButton)) {
            return; // It's already in the correct place, do nothing
        }
        existingButton.remove(); // It's in the wrong place. Delete it.
    }
    
    console.log("✅ Injecting Enhance Button");
    const button = createEnhanceButton();
    button.classList.add('ai-enhance-button');
    
    /**
     * STEP 5: HANDLE BUTTON CLICK
     * This is where the magic happens!
     */
    button.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent any default behavior
        e.stopPropagation(); // Stop event bubbling
        
        try {
            // Update button to show loading state
            const originalHTML = button.innerHTML;
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="animation: spin 1s linear infinite;">
                    <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm0 14a6 6 0 1 1-6-6 6 6 0 0 1-6 6z" opacity="0.3"/>
                    <path d="M14 8a6 6 0 0 0-6-6V0a8 8 0 0 1 8 8z"/>
                </svg>
            `;
            button.disabled = true;
            button.style.cursor = 'wait';
            
            // Add spinning animation if missing
            if (!document.querySelector('#spin-animation-style')) {
                const style = document.createElement('style');
                style.id = 'spin-animation-style';
                style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
                document.head.appendChild(style);
            }
            
            // Get the user's prompt
            const rawPrompt = getUserPrompt();
            
            if (!rawPrompt) {
                alert('Please type a prompt first!');
                return;
            }
            
            console.log("📤 Sending to API:", rawPrompt.substring(0, 50) + "...");
            
            // Call the backend API
            const response = await fetch('http://localhost:8080/api/prompt/enhance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rawPrompt: rawPrompt
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const enhancedPrompt = await response.text();
            console.log("✅ Received enhanced prompt");
            
            /**
             * STEP 6: INSERT THE ENHANCED PROMPT
             * Replace the user's original prompt with the enhanced version
             */
            const inputField = document.querySelector('#prompt-textarea') || 
                             document.querySelector('[contenteditable="true"]') ||
                             document.querySelector('textarea');
            
            if (inputField) {
                // Focus the input field
                inputField.focus();
                
                // Clear existing content
                if (inputField.value !== undefined) {
                    // For textarea elements
                    inputField.value = '';
                } else {
                    // For contenteditable divs
                    inputField.textContent = '';
                    inputField.innerText = '';
                }
                
                // Insert enhanced prompt
                if (inputField.value !== undefined) {
                    // Textarea approach
                    inputField.value = enhancedPrompt;
                    // Trigger input event so ChatGPT recognizes the change
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    // ContentEditable approach
                    document.execCommand('insertText', false, enhancedPrompt);
                    // Alternative method if execCommand doesn't work
                    if (!inputField.textContent) {
                        inputField.textContent = enhancedPrompt;
                        inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
                
                console.log("✅ Enhanced prompt inserted successfully");
                
                // Visual feedback
                inputField.style.transition = 'background-color 0.3s';
                inputField.style.backgroundColor = '#e0f2fe';
                setTimeout(() => {
                    inputField.style.backgroundColor = '';
                }, 600);
                
            } else {
                console.error("❌ Could not find input field to insert enhanced prompt");
                alert('Could not find input field. Please try again.');
            }
            
        } catch (error) {
            console.error("❌ Error enhancing prompt:", error);
            alert('Failed to enhance prompt. Please check that your local API (localhost:8080) is running and accessible.');
        } finally {
            // Restore button to original state
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            `;
            button.disabled = false;
            button.style.cursor = 'pointer';
        }
    });
    
    // Find the first tool button in the container (usually the '+' attach button)
    const attachButton = container.querySelector('button[data-testid="send-button"]') || 
                         container.querySelector('button[type="submit"]') ||
                         container.querySelector('button');
    
    if (attachButton) {
        // Insert before the tool button (keeps it on the far left)
        attachButton.parentElement.insertBefore(button, attachButton);
    } else {
        container.appendChild(button);
    }
}

/**
 * STEP 7: OBSERVE DOM CHANGES
 * FIX: Removed the instant stop block so the script continuously monitors 
 * if ChatGPT switches the DOM between New Chat and Existing Chat.
 */
let debounceTimer;
const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        injectEnhanceButton();
    }, 300);
});

// Start observing the entire document for changes
observer.observe(document.body, { 
    childList: true, 
    subtree: true 
});

/**
 * STEP 8: INITIAL INJECTION
 */
setTimeout(() => {
    console.log("🚀 Attempting initial button injection...");
    injectEnhanceButton();
}, 1000);

console.log("✅ AI Prompt Enhancer initialized");s