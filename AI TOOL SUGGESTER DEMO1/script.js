document.addEventListener('DOMContentLoaded', function() {
    // Handle search button click
    const searchBtn = document.getElementById('search-btn');
    const taskInput = document.getElementById('task-input');
    const resultsContainer = document.getElementById('results-container');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchTools();
        });
    }
    
    if (taskInput) {
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTools();
            }
        });
    }
    
    // Handle clicks on popular task items
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Only handle clicks on the task item itself, not on tool links
            if (e.target.tagName !== 'A') {
                const task = this.getAttribute('data-task');
                if (task) {
                    taskInput.value = task;
                    searchTools();
                    // Scroll to results
                    document.querySelector('.results-section').scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Make tool links clickable
    const toolLinks = document.querySelectorAll('.tool-list a');
    toolLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the parent task item click
            const toolName = this.textContent;
            redirectToTool(toolName);
        });
    });
    
    // Function to search for AI tools based on user input
    function searchTools() {
        const task = taskInput.value.trim();
        if (!task) return;
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Show loading indicator
        resultsContainer.innerHTML = '<div class="loading">Searching for the best AI tools...</div>';
        
        // Simulate API call with setTimeout
        setTimeout(() => {
            // Get tools based on task input
            const tools = getToolsForTask(task);
            
            // Clear loading indicator
            resultsContainer.innerHTML = '';
            
            if (tools.length === 0) {
                resultsContainer.innerHTML = '<div class="no-results">No tools found for this task. Try a different search term.</div>';
                return;
            }
            
            // Display results
            tools.forEach(tool => {
                const resultCard = document.createElement('div');
                resultCard.className = 'result-card';
                resultCard.innerHTML = `
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                    <a href="#" class="tool-link" data-tool="${tool.name}">Visit Tool</a>
                `;
                resultsContainer.appendChild(resultCard);
                
                // Add click event to the tool link
                const toolLink = resultCard.querySelector('.tool-link');
                toolLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    redirectToTool(this.getAttribute('data-tool'));
                });
            });
        }, 800); // Simulated delay for API response
    }

    
    // Function to redirect to the tool website
    function redirectToTool(toolName) {
        // Map of tool names to URLs
        const toolUrls = {
            // Background removal tools
            "Remove.bg": "https://www.remove.bg",
            "Adobe Express": "https://www.adobe.com/express/feature/image/remove-background",
            "Canva Background Remover": "https://www.canva.com/features/background-remover",
            "Pixlr BG": "https://pixlr.com/remove-background",
            "Fotor": "https://www.fotor.com/features/background-remover",
            
            // AI Image Generation
            "DALL-E 3": "https://openai.com/dall-e-3",
            "Midjourney": "https://www.midjourney.com",
            "Stable Diffusion": "https://stability.ai",
            "Leonardo.AI": "https://leonardo.ai",
            "Canva AI Image Generator": "https://www.canva.com/ai-image-generator",
            
            // Transcription Tools
            "Whisper AI": "https://openai.com/research/whisper",
            "Otter.ai": "https://otter.ai",
            "Rev": "https://www.rev.com",
            "Sonix": "https://sonix.ai",
            "Descript": "https://www.descript.com",
            
            // Logo Design
            "Looka": "https://looka.com",
            "Brandmark": "https://brandmark.io",
            "Tailor Brands": "https://www.tailorbrands.com",
            "Wix Logo Maker": "https://www.wix.com/logo/maker",
            "Adobe Express Logo Maker": "https://www.adobe.com/express/create/logo",
            
            // Text Summarization
            "ChatGPT": "https://chat.openai.com",
            "Claude": "https://claude.ai",
            "TLDR This": "https://tldrthis.com",
            "Quillbot Summarizer": "https://quillbot.com/summarize",
            "Wordtune": "https://www.wordtune.com",
            
            // Code Generation
            "GitHub Copilot": "https://github.com/features/copilot",
            "Claude Code": "https://www.anthropic.com",
            "Replit Ghostwriter": "https://replit.com/site/ghostwriter",
            "Amazon CodeWhisperer": "https://aws.amazon.com/codewhisperer",
            
            // Translation
            "DeepL": "https://www.deepl.com",
            "Google Translate": "https://translate.google.com",
            "Microsoft Translator": "https://www.microsoft.com/en-us/translator",
            "Reverso": "https://www.reverso.net",
            
            // Video Generation
            "Runway": "https://runway.ml",
            "Synthesia": "https://www.synthesia.io",
            "HeyGen": "https://www.heygen.com",
            "D-ID": "https://www.d-id.com",
            
            // Email Writing
            "Gmail Smart Compose": "https://workspace.google.com/products/gmail",
            "Lavender": "https://www.lavender.ai",
            "Grammarly": "https://www.grammarly.com",
            "Flowrite": "https://www.flowrite.com",
            "OthersideAI": "https://www.othersideai.com",
            
            // Data Analysis
            "IBM Watson Analytics": "https://www.ibm.com/watson-analytics",
            "Tableau": "https://www.tableau.com",
            "DataRobot": "https://www.datarobot.com",
            "Microsoft Power BI": "https://powerbi.microsoft.com",
            "Google Data Studio": "https://datastudio.google.com",
            
            // Music Generation
            "Suno": "https://www.suno.ai",
            "AIVA": "https://www.aiva.ai",
            "Soundraw": "https://soundraw.io",
            "Ecrett Music": "https://ecrettmusic.com",
            "Amper Music": "https://www.ampermusic.com",
            
            // Photo Editing
            "Adobe Photoshop (with Generative Fill)": "https://www.adobe.com/products/photoshop.html",
            "Luminar AI": "https://skylum.com/luminar-ai",
            "Pixlr": "https://pixlr.com",
            "Remini": "https://remini.ai",
            
            // Voice to Text
            "Google Speech-to-Text": "https://cloud.google.com/speech-to-text",
            "Dragon by Nuance": "https://www.nuance.com/dragon.html",
            "Amazon Transcribe": "https://aws.amazon.com/transcribe",
            "Microsoft Azure Speech": "https://azure.microsoft.com/en-us/services/cognitive-services/speech-to-text",
            
            // Chatbot Building
            "Botpress": "https://botpress.com",
            "Dialogflow": "https://dialogflow.cloud.google.com",
            "ManyChat": "https://manychat.com",
            "ChatGPT API": "https://openai.com/api",
            "Anthropic API": "https://www.anthropic.com/api",
            
            // Presentation Creation
            "Beautiful.ai": "https://www.beautiful.ai",
            "Tome": "https://tome.app",
            "Gamma": "https://gamma.app",
            "Slidebean": "https://slidebean.com",
            "Pitch": "https://pitch.com",
            
            // Text to Speech
            "ElevenLabs": "https://elevenlabs.io",
            "Amazon Polly": "https://aws.amazon.com/polly",
            "Google Text-to-Speech": "https://cloud.google.com/text-to-speech",
            "Microsoft Azure TTS": "https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech",
            "Play.ht": "https://play.ht"
        };
        
        // Get the URL for the tool or use a default search URL
        const url = toolUrls[toolName] || `https://www.google.com/search?q=${encodeURIComponent(toolName + " AI tool")}`;
        
        // Open in a new tab
        window.open(url, '_blank');
    }
    
    // Function to get tools based on user task
    function getToolsForTask(taskQuery) {
        // In a real application, this would be an API call
        // For demo purposes, we'll use a simple matching system
        
        taskQuery = taskQuery.toLowerCase();
        
        // Sample database of tools
        const toolsDatabase = [
            // Background Removal
            {
                categories: ["remove background", "background removal", "transparent background"],
                name: "Remove.bg",
                description: "Automatically remove image backgrounds in 5 seconds with just one click."
            },
            {
                categories: ["remove background", "background removal", "image editing"],
                name: "Adobe Express Background Remover",
                description: "Professional background removal tool with Adobe's AI technology."
            },
            {
                categories: ["remove background", "background removal", "design"],
                name: "Canva Background Remover",
                description: "One-click background removal integrated within Canva's design platform."
            },
            {
                categories: ["remove background", "background removal", "image editing"],
                name: "Pixlr Background Remover",
                description:"AI-driven one-click background removal for seamless editing in Pixlr's intuitive interface."
            },
            {
                categories: ["remove background", "background removal", "image editing"],
                name: "Fotor Background Remover",
                description:"AI-powered one-click photo enhancement and background removal in Fotor." 
            },
            
            // Image Generation
            {
                categories: ["generate images", "create images", "ai art", "image generation"],
                name: "DALL-E 3",
                description: "Create realistic images and art from natural language descriptions."
            },
            {
                categories: ["generate images", "create images", "ai art", "image generation"],
                name: "Midjourney",
                description: "AI image generator that produces highly artistic and creative visuals."
            },
            {
                categories: ["generate images", "create images", "ai art", "image generation"],
                name: "Stable Diffusion",
                description: "Open-source AI image generation model that runs locally or in the cloud."
            },
            {
                categories: ["generate images", "create images", "ai art", "image generation"],
                name: "Lenoardo.AI",
                description:"AI-powered image generation with high-quality, style-consistent visuals."
            },
            {
                categories: ["generate images", "create images", "ai art", "image generation"],
                name: "Canva AI Image Generator",
                description:"AI-powered design assistant for generating creative visuals effortlessly in Canva."  
            },
            
            // Text Summarization
            {
                categories: ["summarize text", "text summary", "article summary", "summarization"],
                name: "TLDR This",
                description: "Automatically summarize any text, article, document, or webpage."
            },
            {
                categories: ["summarize text", "text summary", "article summary", "summarization"],
                name: "ChatGPT",
                description: "AI assistant that can summarize text with adjustable detail levels."
            },
            {
                categories: ["summarize text", "text summary", "article summary", "summarization"],
                name: "Claude",
                description: "AI assistant with strong summarization capabilities and high accuracy."
            },
            {
                categories: ["summarize text", "text summary", "article summary", "summarization"],
                name: "QuillBot Summarizer",
                description: "AI-powered tool for quick and efficient text summarization."
            },
            {
                categories: ["summarize text", "text summary", "article summary", "summarization"],
                name: "Wordtune Summarizer",
                description: "AI-powered tool for quick and clear text summarization."
            },
                        
            
            // Code Generation
            {
                categories: ["generate code", "coding", "programming", "developer tools"],
                name: "GitHub Copilot",
                description: "AI pair programmer that helps you write code faster with suggestions."
            },
            {
                categories: ["generate code", "coding", "programming", "developer tools"],
                name: "Claude Code",
                description: "Advanced AI coding assistant for multiple programming languages."
            },
            {
                categories: ["generate code", "coding", "programming", "developer tools"],
                name: "Replit Ghostwriter",
                description: "AI coding companion built directly into the Replit development environment."
            },
            {
                categories: ["generate code", "coding", "programming", "developer tools"],
                name: "ChatGPT",
                description: "AI-powered coding assistant for generating, debugging, and optimizing code efficiently."
            },
            {
                categories: ["generate code", "coding", "programming", "developer tools"],
                name: "Amazon CodeWhisperer",
                description: "AI-powered coding assistant providing real-time code suggestions and security analysis."
            },

            //Transcribe Audio
            {
                categories: ["transcribe audio", "speech to text", "voice transcription", "audio conversion"],
                name: "Whisper AI",
                description: "AI-powered tool for accurate and fast speech-to-text transcription."
            },
            {
                categories: ["transcribe audio", "speech to text", "voice transcription", "audio conversion"],
                name: "Otter.ai",
                description: "AI-powered tool for real-time transcription and smart meeting summaries."
            },
            {
                categories: ["transcribe audio", "speech to text", "voice transcription", "audio conversion"],
                name: "Rev",
                description: "AI-powered transcription tool offering accurate speech-to-text conversion."
            },
            {
                categories: ["transcribe audio", "speech to text", "voice transcription", "audio conversion"],
                name: "Sonix",
                description: "AI-powered transcription tool with multilingual support and automated subtitles."
            },
            {
                categories: ["transcribe audio", "speech to text", "voice transcription", "audio conversion"],
                name: "Descript",
                description: "AI-powered transcription and editing tool with advanced collaboration features."
            },


            //Design Logos
            {
                categories: ["design logos", "logo creation", "branding", "graphic design"],
                name: "Looka",
                description: "AI-powered logo maker for creating professional and customizable brand logos."
            },
            {
                categories: ["design logos", "logo creation", "branding", "graphic design"],
                name: "Brandmark",
                description: "AI-powered logo maker for creating unique and professional brand identities."
            },
            
            {
                categories: ["design logos", "logo creation", "branding", "graphic design"],
                name: "Tailor Brands",
                description: "AI-driven logo generator offering customizable branding solutions for businesses."
            },
            
            {
                categories: ["design logos", "logo creation", "branding", "graphic design"],
                name: "Wix Logo Maker",
                description: "AI-powered tool for designing personalized logos with full customization options."
            },
            
            {
                categories: ["design logos", "logo creation", "branding", "graphic design"],
                name: "Adobe Express Logo Maker",
                description: "AI-driven logo creator for crafting professional and stylish brand visuals."
            },

            //Text Translator
            {
                categories: ["translate text", "language translation", "multilingual support", "AI translation"],
                name: "DeepL",
                description: "AI-powered translator known for accuracy and natural-sounding translations."
            },
            
            {
                categories: ["translate text", "language translation", "multilingual support", "AI translation"],
                name: "Google Translate",
                description: "AI-driven translation tool supporting 100+ languages with text, speech, and image translation."
            },
            
            {
                categories: ["translate text", "language translation", "multilingual support", "AI translation"],
                name: "ChatGPT",
                description: "AI-powered assistant capable of translating text with contextual understanding."
            },
            
            {
                categories: ["translate text", "language translation", "multilingual support", "AI translation"],
                name: "Microsoft Translator",
                description: "AI-driven translation service integrated into Microsoft products for seamless multilingual communication."
            },
            
            {
                categories: ["translate text", "language translation", "multilingual support", "AI translation"],
                name: "Reverso",
                description: "AI-powered translation tool offering contextual translations and grammar assistance."
            },

            //Generate Videos
            {
                categories: ["generate videos", "AI video creation", "text-to-video", "video editing"],
                name: "Runway",
                description: "AI-powered tool for generating and editing high-quality videos with creative effects."
            },
            
            {
                categories: ["generate videos", "AI video creation", "text-to-video", "video editing"],
                name: "Synthesia",
                description: "AI-driven platform for creating professional videos with avatars and voiceovers in multiple languages."
            },
            
            {
                categories: ["generate videos", "AI video creation", "text-to-video", "video editing"],
                name: "HeyGen",
                description: "AI-powered video generator for creating engaging content with realistic avatars and voice cloning."
            },
            
            {
                categories: ["generate videos", "AI video creation", "text-to-video", "video editing"],
                name: "Descript",
                description: "AI-enhanced video editing tool with text-based editing, voice cloning, and automated captions."
            },
            
            {
                categories: ["generate videos", "AI video creation", "text-to-video", "video editing"],
                name: "D-ID",
                description: "AI-powered tool for generating videos with animated avatars and natural speech synthesis."
            },

            //Draft Emails
            {
                categories: ["draft emails", "email writing", "AI email assistant", "email automation"],
                name: "Gmail Smart Compose",
                description: "AI-powered email assistant that suggests complete sentences for faster drafting."
            },
            
            {
                categories: ["draft emails", "email writing", "AI email assistant", "email automation"],
                name: "Lavender",
                description: "AI-driven email coach that optimizes sales emails with personalization and reply rate insights."
            },
            
            {
                categories: ["draft emails", "email writing", "AI email assistant", "email automation"],
                name: "Grammarly",
                description: "AI-powered tool for drafting, refining, and enhancing email clarity and tone."
            },
            
            {
                categories: ["draft emails", "email writing", "AI email assistant", "email automation"],
                name: "Flowrite",
                description: "AI-powered tool for generating personalized email drafts with smart templates."
            },
            
            {
                categories: ["draft emails", "email writing", "AI email assistant", "email automation"],
                name: "Otherside AI",
                description: "AI-driven email productivity tool that turns bullet points into full, personalized messages."
            },

            //Analyze Data
            {
                categories: ["analyze data", "data visualization", "business intelligence", "AI analytics"],
                name: "IBM Watson Analytics",
                description: "AI-powered tool for analyzing structured and unstructured data with predictive insights."
            },
            
            {
                categories: ["analyze data", "data visualization", "business intelligence", "AI analytics"],
                name: "Tableau",
                description: "Powerful data visualization tool for creating interactive dashboards and reports."
            },
            
            {
                categories: ["analyze data", "data visualization", "business intelligence", "AI analytics"],
                name: "DataRobot",
                description: "AI-driven platform for automated machine learning and predictive analytics."
            },
            
            {
                categories: ["analyze data", "data visualization", "business intelligence", "AI analytics"],
                name: "Microsoft Power BI",
                description: "Business intelligence tool for transforming raw data into interactive insights."
            },
            
            {
                categories: ["analyze data", "data visualization", "business intelligence", "AI analytics"],
                name: "Google Data Studio",
                description: "Free tool for creating customizable and interactive data visualization dashboards."
            },

            //Generate Music
            {
                categories: ["generate music", "AI music composition", "music creation", "sound design"],
                name: "Suno",
                description: "AI-powered tool for generating high-quality songs and personalized music effortlessly."
            },
            
            {
                categories: ["generate music", "AI music composition", "music creation", "sound design"],
                name: "AIVA",
                description: "AI-driven music composer specializing in multi-genre compositions for films, games, and content creators."
            },
            
            {
                categories: ["generate music", "AI music composition", "music creation", "sound design"],
                name: "Soundraw",
                description: "AI-powered music generator offering customizable tracks with genre-blending capabilities."
            },
            
            {
                categories: ["generate music", "AI music composition", "music creation", "sound design"],
                name: "Ecrett Music",
                description: "AI-driven tool for creating royalty-free background music tailored to video content."
            },
            
            {
                categories: ["generate music", "AI music composition", "music creation", "sound design"],
                name: "Amper Music",
                description: "AI-powered platform for generating original soundtracks with customizable mood and structure."
            },

            //Edit photos
            {
                categories: ["edit photos", "photo enhancement", "image retouching", "AI photo editing"],
                name: "Adobe Photoshop",
                description: "Industry-leading photo editing software with AI-powered tools for advanced image manipulation."
            },

            {
                categories: ["edit photos", "photo enhancement", "image retouching", "AI photo editing"],
                name: "Luminar AI",
                description: "AI-driven photo editor offering automated enhancements and creative effects."
            },
            
            {
                categories: ["edit photos", "photo enhancement", "image retouching", "AI photo editing"],
                name: "Pixlr",
                description: "AI-powered online photo editor with quick edits, background removal, and design tools."
            },
            
            {
                categories: ["edit photos", "photo enhancement", "image retouching", "AI photo editing"],
                name: "Fotor",
                description: "AI-enhanced photo editor with one-click enhancements and creative filters."
            },
            
            {
                categories: ["edit photos", "photo enhancement", "image retouching", "AI photo editing"],
                name: "Remini",
                description: "AI-powered tool for restoring and enhancing low-quality or old photos."
            },


            // Voice to Text
            {
                categories: ["voice to text", "speech recognition", "audio transcription", "AI speech-to-text"],
                name: "Google Speech-to-Text",
                description: "AI-powered tool for converting speech into text with support for 125+ languages."
            },
            
            {
                categories: ["voice to text", "speech recognition", "audio transcription", "AI speech-to-text"],
                name: "Dragon by Nuance",
                description: "AI-driven speech recognition software for fast and accurate dictation."
            },
            
            {
                categories: ["voice to text", "speech recognition", "audio transcription", "AI speech-to-text"],
                name: "Amazon Transcribe",
                description: "AI-powered transcription service offering real-time and batch speech-to-text conversion."
            },
            
            {
                categories: ["voice to text", "speech recognition", "audio transcription", "AI speech-to-text"],
                name: "Otter.ai",
                description: "AI-driven tool for real-time transcription and automated meeting summaries."
            },
            
            {
                categories: ["voice to text", "speech recognition", "audio transcription", "AI speech-to-text"],
                name: "Microsoft Azure Speech",
                description: "AI-powered speech service for real-time and batch transcription with custom models."
            },

            //Build Chatbots

            {
                categories: ["build chatbots", "AI chatbot development", "conversational AI", "automation"],
                name: "Botpress",
                description: "Open-source chatbot platform for building and deploying AI-powered conversational agents."
            },
            
            {
                categories: ["build chatbots", "AI chatbot development", "conversational AI", "automation"],
                name: "Dialogflow",
                description: "Google-powered chatbot development platform with natural language understanding and multi-channel support."
            },
            
            {
                categories: ["build chatbots", "AI chatbot development", "conversational AI", "automation"],
                name: "ManyChat",
                description: "AI-driven chatbot builder for automating conversations on social media and messaging platforms."
            },
            
            {
                categories: ["build chatbots", "AI chatbot development", "conversational AI", "automation"],
                name: "ChatGPT API",
                description: "OpenAI's API for integrating advanced conversational AI into applications and services."
            },
            
            {
                categories: ["build chatbots", "AI chatbot development", "conversational AI", "automation"],
                name: "Anthropic API",
                description: "Claude-powered AI chatbot API designed for safe and intelligent conversational experiences."
            },

            //Create presentations
            {
                categories: ["create presentations", "AI presentation design", "slide creation", "business storytelling"],
                name: "Beautiful.ai",
                description: "AI-powered presentation tool with smart templates and automated slide formatting for professional designs."
            },
            
            {
                categories: ["create presentations", "AI presentation design", "slide creation", "business storytelling"],
                name: "Tome",
                description: "AI-driven storytelling platform for dynamic and visually engaging presentations with interactive elements."
            },
            
            {
                categories: ["create presentations", "AI presentation design", "slide creation", "business storytelling"],
                name: "Gamma",
                description: "AI-powered tool for generating polished presentations quickly with customizable templates and real-time collaboration."
            },
            
            {
                categories: ["create presentations", "AI presentation design", "slide creation", "business storytelling"],
                name: "Slidebean",
                description: "AI-enhanced presentation software designed for startups and businesses to create investor-ready pitch decks effortlessly."
            },
            
            {
                categories: ["create presentations", "AI presentation design", "slide creation", "business storytelling"],
                name: "Pitch",
                description: "AI-powered presentation maker with real-time collaboration, customizable templates, and advanced analytics."
            },

            //Text to Speech
            {
                categories: ["text to speech", "AI voice generation", "speech synthesis", "audio conversion"],
                name: "Eleven Labs",
                description: "AI-powered tool for lifelike speech synthesis with emotional awareness and multilingual support."
            },
            
            {
                categories: ["text to speech", "AI voice generation", "speech synthesis", "audio conversion"],
                name: "Amazon Polly",
                description: "AI-driven text-to-speech service offering natural-sounding voices in multiple languages."
            },
            
            {
                categories: ["text to speech", "AI voice generation", "speech synthesis", "audio conversion"],
                name: "Google Text-to-Speech",
                description: "AI-powered speech synthesis tool with deep learning for realistic voice output."
            },
            
            {
                categories: ["text to speech", "AI voice generation", "speech synthesis", "audio conversion"],
                name: "Microsoft Azure TTS",
                description: "AI-driven text-to-speech service with customizable neural voices and real-time synthesis."
            },
            
            {
                categories: ["text to speech", "AI voice generation", "speech synthesis", "audio conversion"],
                name: "Play.ht",
                description: "AI-powered text-to-speech platform with ultra-realistic voices and voice cloning capabilities."
            }
            
            // Add more tools as needed
        ];
        
        // Filter tools that match the user's query
        return toolsDatabase.filter(tool => {
            return tool.categories.some(category => 
                taskQuery.includes(category) || category.includes(taskQuery)
            );
        });
    }
});