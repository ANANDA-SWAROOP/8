document.addEventListener('DOMContentLoaded', () => {
    const newConversationBtn = document.querySelector('.new-conversation');
    const conversationList = document.querySelector('.conversation-list');
    const messageInput = document.querySelector('.input-area input');
    const sendButton = document.querySelector('.input-area button');
    const messagesContainer = document.querySelector('.messages');
    const webAccessToggle = document.querySelector('input[type="checkbox"]');
    const darkModeToggle = document.querySelectorAll('input[type="checkbox"]')[1];

    // New Conversation button
    newConversationBtn.addEventListener('click', () => {
        const newConversation = document.createElement('div');
        newConversation.className = 'conversation';
        newConversation.textContent = 'New Conversation';
        conversationList.appendChild(newConversation);
    });

    // Send message function
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            const userMessage = createMessage('user', message);
            messagesContainer.appendChild(userMessage);
            messageInput.value = '';

            // Detect language and respond
            const detectedLanguage = detectLanguage(message);
            const response = `Detected language: ${detectedLanguage}\n\nHere's a sample response for ${detectedLanguage} code:\n\n${generateSampleResponse(detectedLanguage)}`;
            
            setTimeout(() => {
                const botMessage = createMessage('bot', response);
                messagesContainer.appendChild(botMessage);
            }, 1000);
        }
    }

    // Send button
    sendButton.addEventListener('click', sendMessage);

    // Enter key in input
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Create message element
    function createMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = type === 'user' ? '👤' : '🤖';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.innerHTML = content.replace(/\n/g, '<br>');
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        
        return messageDiv;
    }

    // Web Access toggle
    webAccessToggle.addEventListener('change', (e) => {
        console.log('Web Access:', e.target.checked ? 'Enabled' : 'Disabled');
        // Implement web access functionality here
    });

    // Dark Mode toggle
    darkModeToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
    });

    // Simple language detection function
    function detectLanguage(code) {
        if (code.includes('print(') || code.includes('def ')) return 'Python';
        if (code.includes('console.log(') || code.includes('function ')) return 'JavaScript';
        if (code.includes('System.out.println(') || code.includes('public class ')) return 'Java';
        if (code.includes('cout <<') || code.includes('#include')) return 'C++';
        if (code.includes('fmt.Println(') || code.includes('func ')) return 'Go';
        if (code.includes('puts ') || code.includes('def ')) return 'Ruby';
        if (code.includes('echo ') || code.includes('<?php')) return 'PHP';
        return 'Unknown';
    }

    // Generate a sample response based on detected language
    function generateSampleResponse(language) {
        switch (language) {
            case 'Python':
                return 'def greet(name):\n    print(f"Hello, {name}!")';
            case 'JavaScript':
                return 'function greet(name) {\n    console.log(`Hello, ${name}!`);\n}';
            case 'Java':
                return 'public class Greeting {\n    public static void greet(String name) {\n        System.out.println("Hello, " + name + "!");\n    }\n}';
            case 'C++':
                return '#include <iostream>\n\nvoid greet(std::string name) {\n    std::cout << "Hello, " << name << "!" << std::endl;\n}';
            case 'Go':
                return 'func greet(name string) {\n    fmt.Printf("Hello, %s!\\n", name)\n}';
            case 'Ruby':
                return 'def greet(name)\n    puts "Hello, #{name}!"\nend';
            case 'PHP':
                return '<?php\nfunction greet($name) {\n    echo "Hello, " . $name . "!";\n}\n?>';
            default:
                return 'Sorry, I couldn\'t generate a sample for the detected language.';
        }
    }
});
