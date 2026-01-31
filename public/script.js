const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Store full conversation history
const conversation = [];

// Handle form submit
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) return;

    // 1. Add user message to UI
    appendMessage('user', userMessage);

    // 2. Add user message to conversation history
    conversation.push({
        role: 'user',
        text: userMessage
    });

    input.value = '';

    // 3. Show temporary thinking message
    const thinkingEl = appendMessage('bot', 'Thinking...');

    try {
        // 4. Send POST request to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversation: conversation
            })
        });

        if (!response.ok) {
            throw new Error('Server responded with an error');
        }

        const data = await response.json();

        // 5. Replace thinking message with AI response
        if (data && data.result) {
            thinkingEl.textContent = data.result;

            // 6. Save model response to conversation history
            conversation.push({
                role: 'model',
                text: data.result
            });
        } else {
            thinkingEl.textContent = 'Sorry, no response received.';
        }

    } catch (error) {
        console.error(error);
        thinkingEl.textContent = 'Failed to get response from server.';
    }
});

// Append message helper
function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;

    return msg; // return element so we can update it later
}
