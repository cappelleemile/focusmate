// DOM Elements
const dailyGoalsInput = document.getElementById('dailyGoals');
const generatePlanButton = document.getElementById('generatePlan');
const tasksList = document.getElementById('tasksList');
const tasksContainer = document.getElementById('tasksContainer');
const prioritizeTasksButton = document.getElementById('prioritizeTasks');
const timerDisplay = document.getElementById('timer');
const startPomodoroButton = document.getElementById('startPomodoro');
const resetPomodoroButton = document.getElementById('resetPomodoro');
const dailyReflectionInput = document.getElementById('dailyReflection');

// State
let isPomodoroRunning = false;
let pomodoroTimeLeft = 25 * 60; // 25 minutes in seconds
let pomodoroInterval;
let tasks = [];
let reflection = '';

// OpenAI API Configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Task Management Functions
function createTaskElement(task, index) {
    const taskElement = document.createElement('div');
    taskElement.className = 'flex items-center gap-2 p-2 bg-gray-50 rounded-md';
    
    const taskText = document.createElement('span');
    taskText.className = 'flex-1';
    taskText.textContent = task;
    
    const removeButton = document.createElement('button');
    removeButton.className = 'text-red-500 hover:text-red-700';
    removeButton.textContent = '×';
    removeButton.addEventListener('click', () => removeTask(index));
    
    taskElement.appendChild(taskText);
    taskElement.appendChild(removeButton);
    
    return taskElement;
}

function addTask() {
    const taskInput = tasksList.querySelector('input');
    const task = taskInput.value.trim();
    
    if (task) {
        // Check for duplicate tasks
        if (tasks.includes(task)) {
            alert('This task already exists!');
            return;
        }
        
        tasks.push(task);
        taskInput.value = '';
        renderTasks();
        
        // Focus back on input
        taskInput.focus();
    }
}

function removeTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function renderTasks() {
    // Clear the tasks container
    tasksContainer.innerHTML = '';
    
    // Add all tasks
    tasks.forEach((task, index) => {
        tasksContainer.appendChild(createTaskElement(task, index));
    });
}

// Daily Reflection Functions
async function generateReflectionSummary() {
    reflection = dailyReflectionInput.value.trim();
    if (!reflection) {
        alert('Please add your reflection first.');
        return;
    }

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
                        content: "You are a productivity coach helping to analyze daily reflections and provide insights."
                    },
                    {
                        role: "user",
                        content: `Analyze this daily reflection and provide: 
                                1. A summary of achievements
                                2. Areas for improvement
                                3. Suggestions for tomorrow
                                Reflection: ${reflection}`
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const summary = data.choices[0].message.content;

        // Create a new section to display the summary
        const summarySection = document.createElement('div');
        summarySection.className = 'mt-4 p-4 bg-purple-50 rounded-md';
        summarySection.innerHTML = `
            <h3 class="font-semibold mb-2">Reflection Analysis:</h3>
            <p class="whitespace-pre-line">${summary}</p>
        `;

        // Insert the summary after the reflection section
        dailyReflectionInput.parentNode.appendChild(summarySection);

    } catch (error) {
        console.error('Error generating reflection summary:', error);
        alert('An error occurred while generating the reflection summary. Please try again.');
    }
}

// Prioritize tasks using OpenAI
async function prioritizeTasks() {
    if (tasks.length < 2) {
        alert('Please add at least 2 tasks to prioritize them.');
        return;
    }

    try {
        if (!config.OPENAI_API_KEY || config.OPENAI_API_KEY === 'your-api-key-here') {
            throw new Error('Please add your OpenAI API key to config.js');
        }

        prioritizeTasksButton.disabled = true;
        prioritizeTasksButton.textContent = 'Prioritizing...';

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
                        content: "You are a productivity coach helping to prioritize tasks based on importance and urgency."
                    },
                    {
                        role: "user",
                        content: `Please prioritize these tasks and explain why: ${tasks.join(', ')}`
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const prioritization = data.choices[0].message.content;

        // Remove any existing prioritization
        const existingPrioritization = tasksList.parentNode.querySelector('.bg-green-50');
        if (existingPrioritization) {
            existingPrioritization.remove();
        }

        // Create a new section to display the prioritization
        const prioritizationSection = document.createElement('div');
        prioritizationSection.className = 'mt-4 p-4 bg-green-50 rounded-md';
        prioritizationSection.innerHTML = `
            <h3 class="font-semibold mb-2">Task Prioritization:</h3>
            <p class="whitespace-pre-line">${prioritization}</p>
        `;

        // Insert the prioritization after the tasks section
        tasksList.parentNode.appendChild(prioritizationSection);

    } catch (error) {
        console.error('Error prioritizing tasks:', error);
        alert('An error occurred while prioritizing tasks. Please try again.');
    } finally {
        prioritizeTasksButton.disabled = false;
        prioritizeTasksButton.textContent = 'Prioritize Tasks';
    }
}

// Event Listeners for Tasks
const taskInput = tasksList.querySelector('input');
const addTaskButton = tasksList.querySelector('button');

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

prioritizeTasksButton.addEventListener('click', prioritizeTasks);

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

function resetTimer() {
    clearInterval(pomodoroInterval);
    isPomodoroRunning = false;
    pomodoroTimeLeft = 25 * 60;
    updateTimerDisplay();
    startPomodoroButton.textContent = 'Start';
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
resetPomodoroButton.addEventListener('click', resetTimer);

// Initialize
updateTimerDisplay(); 