# FocusMate - AI Productivity Assistant

FocusMate is a minimalist AI-powered productivity web application that helps you stay focused and organized throughout your day. Built with vanilla JavaScript and Tailwind CSS, it provides a clean and intuitive interface for managing your daily tasks and goals.

## 🚀 Live Demo

Try FocusMate live: <a href="https://cappelleemile.github.io/focusmate/" target="_blank">https://cappelleemile.github.io/focusmate/</a>

## Features

### 🎯 Daily Goals & Planning
- Set your daily goals
- Generate AI-powered daily plans
- Get structured time blocks and action items
- Realistic and achievable planning

### ✅ Task Management
- Add and remove tasks
- Prevent duplicate tasks
- AI-powered task prioritization
- Clean and intuitive task interface
- Keyboard shortcuts (Enter to add tasks)

### ⏱️ Pomodoro Timer
- 25-minute focus sessions
- Start/Pause functionality
- Reset option
- Visual timer display
- Session completion notification

### 🤔 Daily Reflection
- Write daily reflections
- AI-powered reflection analysis
- Get insights on achievements
- Identify areas for improvement
- Receive suggestions for tomorrow

## Setup

1. Clone the repository:
```bash
git clone https://github.com/cappelleemile/FocusMate.git
cd FocusMate
```

2. Create a `config.js` file in the root directory:
```javascript
const config = {
    OPENAI_API_KEY: 'your-api-key-here'
};
```

3. Get your OpenAI API key:
   - Sign up at [OpenAI](https://platform.openai.com)
   - Create an API key in your dashboard
   - Replace 'your-api-key-here' in config.js with your actual API key

4. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## Technologies Used

- HTML5
- CSS3 (Tailwind CSS)
- Vanilla JavaScript
- OpenAI API (GPT-3.5 Turbo)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

The GPL-3.0 license ensures that:
- The software remains free and open source
- Any modifications must also be open source
- Users have the freedom to run, study, share, and modify the software
- All derivative works must also be licensed under GPL-3.0

## Acknowledgments

- OpenAI for providing the AI capabilities
- Tailwind CSS for the beautiful UI components
- The open-source community for inspiration and support