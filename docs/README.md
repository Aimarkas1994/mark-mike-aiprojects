# Professional Portfolio Website

A modern, responsive portfolio website built with HTML, CSS, and JavaScript. Features GitHub API integration and professional design.

## 🌐 Live Demo

Visit the live website: **https://aimarkas1994.github.io/mark-mike-aiprojects/**

## ✨ Features

- **Modern Design**: Clean, professional layout with smooth animations
- **Responsive**: Mobile-first design that works on all devices
- **GitHub Integration**: Real-time GitHub stats and repository display
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Dark Mode**: Automatic dark mode support based on system preferences
- **Accessibility**: ARIA labels and keyboard navigation support
- **Performance**: Optimized loading with lazy loading and efficient CSS
- **Professional Sections**: Hero, About, Skills, Projects, GitHub Activity, Contact

## 🏗️ Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript**: No framework dependencies
- **GitHub API**: Real-time data integration
- **Font Awesome**: Professional icons
- **Google Fonts**: Inter font for modern typography

## 📁 Project Structure

```
docs/
├── index.html          # Main portfolio page
├── css/
│   ├── style.css      # Main styles
│   └── responsive.css # Mobile and responsive styles
├── js/
│   └── script.js      # GitHub API and interactions
└── README.md          # This file
```

## 🚀 Setup & Deployment

### Local Development

1. Clone the repository
2. Navigate to the project directory
3. Open `docs/index.html` in your browser or use a local server

### GitHub Pages Deployment

This website is automatically deployed via GitHub Pages:

1. Files are stored in the `/docs` directory
2. GitHub Pages is configured to serve from `/docs`
3. Any push to the `main` branch automatically updates the live site

## 🎨 Customization

### Personal Information
Edit `index.html` to update:
- Your name and title
- About section content
- Contact information
- Skills and technologies

### Projects
Update the projects array in `js/script.js` to showcase your work:

```javascript
const projects = [
    {
        title: 'Your Project Name',
        description: 'Project description...',
        technologies: ['Tech1', 'Tech2', 'Tech3'],
        githubUrl: 'https://github.com/yourusername/project',
        liveUrl: 'https://project-demo.com'
    }
];
```

### Styling
- Modify colors in `css/style.css` CSS variables
- Update fonts and spacing as needed
- Add custom animations or transitions

## 🔧 Features Breakdown

### Navigation
- Fixed header with smooth scroll
- Mobile-responsive hamburger menu
- Active link highlighting

### Hero Section
- Eye-catching gradient background
- Call-to-action buttons
- Social media links

### GitHub Integration
- Real-time user statistics
- Repository display with descriptions
- Language indicators and star counts
- Automatic caching for performance

### Contact Form
- Professional contact layout
- Basic form validation
- Success message display (client-side only)

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions

## 🌍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## 📱 Mobile Features

- Touch-optimized navigation
- Responsive grid layouts
- Optimized typography for small screens
- Fast loading on mobile networks

## ⚡ Performance Features

- Lazy loading for images
- CSS-only animations
- Efficient JavaScript with event delegation
- Minimal external dependencies
- Optimized for Core Web Vitals

## 🔧 Development Commands

Since this is a static site, there are no build commands. However, for local development:

```bash
# Serve locally (if you have Python)
cd docs
python -m http.server 8000

# Or use any local server
# Open docs/index.html in your browser
```

## 🤝 Contributing

Feel free to fork this repository and customize it for your own portfolio. If you find any issues or have suggestions, please open an issue.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🚀 Future Enhancements

- [ ] Blog section integration
- [ ] Project filtering by technology
- [ ] Advanced contact form with backend
- [ ] Custom domain support
- [ ] Analytics integration
- [ ] PWA (Progressive Web App) features

---

Built with ❤️ by Mark & Mike 🤔