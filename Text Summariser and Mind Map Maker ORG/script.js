document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const userContentEl = document.getElementById('userContent');
    const generateBtn = document.getElementById('generateBtn');
    const loadingEl = document.getElementById('loading');
    const resultsContainerEl = document.getElementById('resultsContainer');
    const summaryContentEl = document.getElementById('summaryContent');
    const mindMapContainerEl = document.getElementById('mindMapContainer');
    const mindMapEl = document.getElementById('mindMap');

    // Mind map state and configuration
    let mindMapState = {
        scale: 1,
        data: null,
        layout: 'radial'
    };

    // Configuration constants for different screen sizes
    const config = {
        desktop: {
            mainRadius: 180,
            leafRadius: 120,
            maxSubTopics: 5,
            maxLeafNodes: 3
        },
        tablet: {
            mainRadius: 150,
            leafRadius: 100,
            maxSubTopics: 4,
            maxLeafNodes: 2
        },
        mobile: {
            mainRadius: 0,
            leafRadius: 0,
            maxSubTopics: 3,
            maxLeafNodes: 1,
            gridSpacingX: 120,
            gridSpacingY: 100
        }
    };

    // Add event listeners
    generateBtn.addEventListener('click', generateResults);
    window.addEventListener('resize', debounce(handleResize, 250));

    document.getElementById('zoomIn').addEventListener('click', () => zoomMindMap(0.1));
    document.getElementById('zoomOut').addEventListener('click', () => zoomMindMap(-0.1));
    document.getElementById('zoomReset').addEventListener('click', () => resetZoom());

    const layoutToggle = document.getElementById('layoutToggle');
    if (layoutToggle) {
        layoutToggle.addEventListener('click', toggleLayout);
    }

    function toggleLayout() {
        if (mindMapState.layout === 'radial') {
            mindMapState.layout = 'grid';
            layoutToggle.textContent = 'Radial Layout';
        } else {
            mindMapState.layout = 'radial';
            layoutToggle.textContent = 'Grid Layout';
        }

        if (mindMapState.data) {
            renderMindMap(mindMapState.data);
        }
    }

    function zoomMindMap(delta) {
        const newScale = Math.max(0.5, Math.min(2, mindMapState.scale + delta));
        mindMapState.scale = newScale;
        mindMapEl.style.transform = `scale(${newScale})`;
    }

    function resetZoom() {
        mindMapState.scale = 1;
        mindMapEl.style.transform = 'scale(1)';
    }

    function handleResize() {
        if (!resultsContainerEl.classList.contains('hidden') && mindMapState.data) {
            renderMindMap(mindMapState.data);
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    function generateResults() {
        const text = userContentEl.value.trim();

        if (!text) {
            alert('Please enter some content to summarize.');
            return;
        }

        loadingEl.style.display = 'block';
        resultsContainerEl.classList.add('hidden');

        setTimeout(() => {
            const summary = generateSummary(text);
            const mindMapData = extractMindMapData(summary, text);
            mindMapState.data = mindMapData;

            summaryContentEl.innerHTML = summary;
            renderMindMap(mindMapData);

            loadingEl.style.display = 'none';
            resultsContainerEl.classList.remove('hidden');

            resetZoom();
        }, 1500);
    }

    function generateSummary(text) {
        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
        const wordFreq = {};
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];

        words.forEach(word => {
            if (word.length > 3) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        const sentenceScores = sentences.map(sentence => {
            const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
            let score = 0;
            sentenceWords.forEach(word => {
                if (wordFreq[word]) {
                    score += wordFreq[word];
                }
            });
            return {
                sentence,
                score: score / Math.max(1, sentenceWords.length)
            };
        });

        sentenceScores.sort((a, b) => b.score - a.score);

        const numSentences = Math.max(1, Math.ceil(sentences.length * 0.3));
        const topSentences = sentenceScores.slice(0, numSentences)
            .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
            .map(item => item.sentence);

        return topSentences.join(' ');
    }

    function extractMindMapData(summary, fullText) {
        const screenConfig = getScreenConfig();
        const allWords = fullText.toLowerCase().match(/\b\w+\b/g) || [];
        const wordFreq = {};

        const stopwords = [
            'the', 'and', 'to', 'of', 'in', 'that', 'is', 'it', 'for', 'was', 
            'with', 'as', 'be', 'this', 'on', 'are', 'at', 'by', 'have', 'from', 
            'not', 'they', 'you', 'but', 'their', 'has', 'been', 'would', 'which', 
            'or', 'we', 'an', 'were', 'these', 'your', 'when', 'can', 'our', 'will',
            'what', 'there', 'all', 'if', 'who', 'how', 'more', 'about', 'into',
            'than', 'them', 'then', 'some', 'her', 'his', 'had', 'should', 'other'
        ];

        allWords.forEach(word => {
            if (word.length > 3 && !stopwords.includes(word)) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        const sortedWords = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a]);
        const mainTopic = sortedWords[0] || 'Topic';

        const subTopics = sortedWords.slice(1, screenConfig.maxSubTopics).map(topic => {
            const relatedWords = [];
            const regex = new RegExp(`\\b${topic}\\b[\\s\\S]{1,50}\\b(\\w+)\\b`, 'gi');
            let match;

            while ((match = regex.exec(fullText)) !== null) {
                const relatedWord = match[1].toLowerCase();
                if (relatedWord.length > 3 && !stopwords.includes(relatedWord) && relatedWord !== topic) {
                    relatedWords.push(relatedWord);
                }
            }

            const uniqueRelated = [...new Set(relatedWords)]
                .slice(0, screenConfig.maxLeafNodes)
                .map(word => ({
                    name: word.charAt(0).toUpperCase() + word.slice(1),
                    value: wordFreq[word] || 1
                }));

            return {
                name: topic.charAt(0).toUpperCase() + topic.slice(1),
                value: wordFreq[topic],
                children: uniqueRelated
            };
        });

        return {
            name: mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1),
            value: wordFreq[mainTopic.toLowerCase()],
            children: subTopics
        };
    }

    function getScreenConfig() {
        if (window.innerWidth <= 480) {
            return config.mobile;
        } else if (window.innerWidth <= 768) {
            return config.tablet;
        } else {
            return config.desktop;
        }
    }

    function renderMindMap(data) {
        mindMapEl.innerHTML = '';

        const mapWidth = mindMapEl.offsetWidth;
        const mapHeight = mindMapEl.offsetHeight;
        const centerX = mapWidth / 2;
        const centerY = mapHeight / 2;

        const screenConfig = getScreenConfig();
        const useGridLayout = window.innerWidth <= 480 || mindMapState.layout === 'grid';

        if (useGridLayout) {
            renderGridLayout(data, centerX, centerY, screenConfig);
        } else {
            renderRadialLayout(data, centerX, centerY, screenConfig, mapWidth, mapHeight);
        }
    }

    function renderGridLayout(data, centerX, centerY, config) {
        const mainNode = createNode(data.name, centerX, centerY, 'node-main');
        mindMapEl.appendChild(mainNode);

        const numSubTopics = data.children.length;
        const gridColumns = window.innerWidth <= 480 ? 1 : 2;
        const rows = Math.ceil(numSubTopics / gridColumns);
        const spacingX = config.gridSpacingX || 160;
        const spacingY = config.gridSpacingY || 120;

        const startX = centerX - ((gridColumns - 1) * spacingX) / 2;
        const startY = centerY + 80;

        data.children.forEach((subTopic, index) => {
            const column = gridColumns === 1 ? 0 : index % gridColumns;
            const row = Math.floor(index / gridColumns);
            const x = startX + column * spacingX;
            const y = startY + row * spacingY;

            const subNode = createNode(subTopic.name, x, y, 'node-sub');
            mindMapEl.appendChild(subNode);

            const connection = createConnection(centerX, centerY, x, y);
            mindMapEl.appendChild(connection);

            if (subTopic.children && subTopic.children.length) {
                subTopic.children.forEach((leaf, leafIndex) => {
                    const leafSpacing = 70;
                    const leafX = x;
                    const leafY = y + (leafIndex + 1) * leafSpacing;

                    const leafNode = createNode(leaf.name, leafX, leafY, 'node-leaf');
                    mindMapEl.appendChild(leafNode);

                    const leafConnection = createConnection(x, y, leafX, leafY);
                    mindMapEl.appendChild(leafConnection);
                });
            }
        });
    }

    function renderRadialLayout(data, centerX, centerY, config, mapWidth, mapHeight) {
        const mainNode = createNode(data.name, centerX, centerY, 'node-main');
        mindMapEl.appendChild(mainNode);

        const numSubTopics = data.children.length;
        let mainRadius = config.mainRadius;

        if (numSubTopics > 4) {
            mainRadius *= 1.1;
        }

        const minNodeSize = 100;
        const circumference = 2 * Math.PI * mainRadius;
        const idealAngularGap = (minNodeSize / circumference) * 2 * Math.PI;
        const actualAngularGap = (2 * Math.PI) / numSubTopics;
        const needsAdjustment = actualAngularGap < idealAngularGap && numSubTopics > 3;

        data.children.forEach((subTopic, index) => {
            let angle;

            if (needsAdjustment) {
                const arcSize = Math.min(2 * Math.PI, idealAngularGap * numSubTopics);
                const startAngle = -arcSize / 2;
                angle = startAngle + (index / (numSubTopics - 1)) * arcSize;
            } else {
                angle = (index / numSubTopics) * 2 * Math.PI;
            }

            const x = centerX + mainRadius * Math.cos(angle);
            const y = centerY + mainRadius * Math.sin(angle);

            const subNode = createNode(subTopic.name, x, y, 'node-sub');
            mindMapEl.appendChild(subNode);

            const connection = createConnection(centerX, centerY, x, y);
            mindMapEl.appendChild(connection);

            if (subTopic.children && subTopic.children.length) {
                const leafRadius = config.leafRadius;
                const numLeaves = subTopic.children.length;
                const spreadAngle = numLeaves <= 1 ? 0 : Math.PI / 3;

                subTopic.children.forEach((leaf, leafIndex) => {
                    let leafAngle;
                    if (numLeaves === 1) {
                        leafAngle = angle;
                    } else {
                        const totalSpreadAngle = spreadAngle * (numLeaves - 1);
                        const baseLeafAngle = angle - (totalSpreadAngle / 2);
                        leafAngle = baseLeafAngle + (spreadAngle * leafIndex);
                    }

                    const leafX = x + leafRadius * Math.cos(leafAngle);
                    const leafY = y + leafRadius * Math.sin(leafAngle);

                    const margin = 50;
                    const adjustedLeafX = Math.max(margin, Math.min(mapWidth - margin, leafX));
                    const adjustedLeafY = Math.max(margin, Math.min(mapHeight - margin, leafY));

                    const leafNode = createNode(leaf.name, adjustedLeafX, adjustedLeafY, 'node-leaf');
                    mindMapEl.appendChild(leafNode);

                    const leafConnection = createConnection(x, y, adjustedLeafX, adjustedLeafY);
                    mindMapEl.appendChild(leafConnection);
                });
            }
        });
    }

    function createNode(text, x, y, className) {
        const node = document.createElement('div');
        node.className = `node ${className || ''}`;
        node.textContent = text;
        node.title = text;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        return node;
    }

    function createConnection(x1, y1, x2, y2) {
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        const connection = document.createElement('div');
        connection.className = 'connection';
        connection.style.width = `${length}px`;
        connection.style.left = `${x1}px`;
        connection.style.top = `${y1}px`;
        connection.style.transform = `rotate(${angle}deg)`;

        return connection;
    }
});



// image-blured
document.addEventListener("DOMContentLoaded", () => {
    const textarea = document.getElementById("userContent");
  
    textarea.addEventListener("focus", () => {
      document.body.classList.add("blur-background");
    });
  
    textarea.addEventListener("blur", () => {
      document.body.classList.remove("blur-background");
    });
  });
  