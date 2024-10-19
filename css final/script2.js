console.log("Script is loading");

document.addEventListener('DOMContentLoaded', () => {
    const newConversationBtn = document.querySelector('.new-conversation');
    const conversationList = document.querySelector('.conversation-list');
    const messageInput = document.querySelector('.input-area input');
    const sendButton = document.querySelector('.input-area button');
    const messagesContainer = document.querySelector('.messages');
    const webAccessToggle = document.querySelector('input[type="checkbox"]');
    const darkModeToggle = document.getElementById('darkModeToggle');

    let conversations = [];
    let currentConversationIndex = -1;

    // New Conversation button
    newConversationBtn.addEventListener('click', createConversation);

    // Send message function
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message && currentConversationIndex !== -1) {
            const userMessage = { type: 'user', content: message };
            conversations[currentConversationIndex].messages.push(userMessage);
            const userMessageElem = createMessage('user', message);
            messagesContainer.appendChild(userMessageElem);
            messageInput.value = '';

            // Update conversation summary
            if (conversations[currentConversationIndex].messages.length === 2) {  // Changed from 1 to 2 because of bot intro
                conversations[currentConversationIndex].summary = message.substring(0, 20) + (message.length > 20 ? '...' : '');
            }

            updateConversationList();

            // Simulate bot response
            setTimeout(() => {
                const detectedLanguage = detectLanguage(message);
                const sampleCode = generateSampleResponse(detectedLanguage);
                const botMessage = { type: 'bot', content: `Detected language: ${detectedLanguage}\n\nHere's a sample code:\n\n${sampleCode}` };
                conversations[currentConversationIndex].messages.push(botMessage);
                const botMessageElem = createMessage('bot', botMessage.content);
                messagesContainer.appendChild(botMessageElem);
                updateConversationList();
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
        contentDiv.textContent = content;
        
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
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', darkModeToggle.checked);
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

    function createConversation() {
        const newConversation = {
            id: Date.now(),
            messages: [],
            summary: 'New Conversation'
        };
        conversations.push(newConversation);
        currentConversationIndex = conversations.length - 1;
        updateConversationList();
        clearMessages();
        
        // Add initial bot message
        const initialMessage = { 
            type: 'bot', 
            content: "Hello! I am VulnScan Bot, an AI-powered assistant designed to help identify and explain potential security vulnerabilities in your code. I can analyze code snippets, detect the programming language, and provide sample secure coding practices. How can I assist you with your code security today?"
        };
        conversations[currentConversationIndex].messages.push(initialMessage);
        const initialMessageElem = createMessage('bot', initialMessage.content);
        messagesContainer.appendChild(initialMessageElem);
    }

    function updateConversationList() {
        conversationList.innerHTML = '';
        conversations.forEach((conv, index) => {
            const convElem = document.createElement('div');
            convElem.className = `conversation ${index === currentConversationIndex ? 'active' : ''}`;
            convElem.innerHTML = `
                <div class="conversation-title">${conv.summary}</div>
                <div class="conversation-preview">${getConversationPreview(conv)}</div>
            `;
            convElem.addEventListener('click', () => switchConversation(index));
            conversationList.appendChild(convElem);
        });
    }

    function getConversationPreview(conversation) {
        if (conversation.messages.length === 0) {
            return 'No messages yet';
        }
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        return lastMessage.content.substring(0, 30) + (lastMessage.content.length > 30 ? '...' : '');
    }

    function switchConversation(index) {
        currentConversationIndex = index;
        updateConversationList();
        displayConversation(conversations[index]);
    }

    function displayConversation(conversation) {
        clearMessages();
        conversation.messages.forEach(msg => {
            const messageElem = createMessage(msg.type, msg.content);
            messagesContainer.appendChild(messageElem);
        });
    }

    function clearMessages() {
        messagesContainer.innerHTML = '';
    }

    // Create the first conversation
    createConversation();

    function toggleSidebar() {
        document.body.classList.toggle('sidebar-closed');
        document.querySelector('.sidebar').classList.toggle('closed');
        document.querySelector('.chat-area').classList.toggle('full-width');
    }

    document.querySelector('.close-sidebar').addEventListener('click', toggleSidebar);
    document.querySelector('.open-sidebar').addEventListener('click', toggleSidebar);
});
