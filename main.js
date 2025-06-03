// DOM Elements
const dailyGoalsInput = document.getElementById('dailyGoals');
const generatePlanButton = document.getElementById('generatePlan');
const tasksList = document.getElementById('tasksList');
const prioritizeTasksButton = document.getElementById('prioritizeTasks');
const timerDisplay = document.getElementById('timer');
const startPomodoroButton = document.getElementById('startPomodoro');
const dailyReflectionInput = document.getElementById('dailyReflection');

// State
let isPomodoroRunning = false;
let pomodoroTimeLeft = 25 * 60; // 25 minutes in seconds
let pomodoroInterval;

// OpenAI API Configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Generate daily plan using OpenAI
async function generateDailyPlan(goals) {
    try {
        if (!config.OPENAI_API_KEY || config.OPENAI_API_KEY === 'your-api-key-here') {
            throw new Error('Please add your OpenAI API key to config.js');
        }

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a productivity coach helping to create a structured daily plan."
                    },
                    {
                        role: "user",
                        content: `Create a structured daily plan based on these goals: ${goals}. 
                                Provide specific time blocks and action items. 
                                Keep it realistic and achievable.`
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating plan:', error);
        return 'An error occurred while generating the plan. Please check if your API key is correctly set in config.js';
    }
}

// Event Listeners
generatePlanButton.addEventListener('click', async () => {
    const goals = dailyGoalsInput.value.trim();
    if (!goals) {
        alert('Please enter your goals first.');
        return;
    }

    generatePlanButton.disabled = true;
    generatePlanButton.textContent = 'Generating...';

    const plan = await generateDailyPlan(goals);
    
    // Create a new section to display the plan
    const planSection = document.createElement('div');
    planSection.className = 'mt-4 p-4 bg-blue-50 rounded-md';
    planSection.innerHTML = `
        <h3 class="font-semibold mb-2">Your Daily Plan:</h3>
        <p class="whitespace-pre-line">${plan}</p>
    `;

    // Insert the plan after the goals section
    dailyGoalsInput.parentNode.appendChild(planSection);

    generatePlanButton.disabled = false;
    generatePlanButton.textContent = 'Generate Daily Plan';
});

// Pomodoro Timer Functions
function updateTimerDisplay() {
    const minutes = Math.floor(pomodoroTimeLeft / 60);
    const seconds = pomodoroTimeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function togglePomodoro() {
    if (isPomodoroRunning) {
        clearInterval(pomodoroInterval);
        startPomodoroButton.textContent = 'Start';
        isPomodoroRunning = false;
    } else {
        pomodoroInterval = setInterval(() => {
            if (pomodoroTimeLeft > 0) {
                pomodoroTimeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(pomodoroInterval);
                startPomodoroButton.textContent = 'Start';
                isPomodoroRunning = false;
                pomodoroTimeLeft = 25 * 60;
                updateTimerDisplay();
                alert('Pomodoro session completed!');
            }
        }, 1000);
        startPomodoroButton.textContent = 'Pause';
        isPomodoroRunning = true;
    }
}

startPomodoroButton.addEventListener('click', togglePomodoro);

// Initialize
updateTimerDisplay(); 