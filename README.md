# Portfolio Website

A modern, accessible Jekyll portfolio website built on the original design by [Jami Gibbs](https://github.com/jamigibbs/portfolio). This version has been enhanced with comprehensive accessibility features while maintaining the clean, professional aesthetic of the original theme.

## Original Theme Credits

This portfolio is based on the excellent work by **Jami Gibbs**. The original theme provides a beautiful, minimalist foundation that has been respectfully extended with accessibility improvements. All credit for the core design, layout, and Jekyll structure goes to the original author.

- **Original Author**: Jami Gibbs
- **Original Repository**: [jamigibbs/portfolio](https://github.com/jamigibbs/portfolio)
- **Theme Version**: 2.0.1

## Accessibility Enhancements

This fork includes comprehensive accessibility improvements designed to meet WCAG 2.1 standards while seamlessly integrating with the original design:

### 🔊 Text-to-Speech (TTS) Features
- **Web Speech API Integration**: Native browser TTS support with English (en-US) language
- **Intelligent Content Reading**: Automatically identifies and reads page content including:
  - Introduction sections
  - Project descriptions
  - Footer content
  - Main headings
- **Visual Feedback**: Subtle highlighting of readable content when TTS is active
- **Speech Controls**: Play, pause, and stop functionality with voice status indicators

### 📝 Dynamic Font Scaling
- **Flexible Text Sizing**: Scale fonts from 80% to 140% of original size
- **CSS Custom Properties**: Uses modern CSS variables for smooth scaling
- **Persistent Settings**: Font preferences saved in browser localStorage
- **Responsive Integration**: Works seamlessly across all device breakpoints

### ⌨️ Keyboard Accessibility
- **Comprehensive Shortcuts**:
  - `Alt + T`: Toggle Text-to-Speech
  - `Alt + Plus (+)`: Increase font size
  - `Alt + Minus (-)`: Decrease font size  
  - `Alt + 0`: Reset font size to default
  - `Escape`: Stop speech and close TTS
- **Screen Reader Support**: Full ARIA labels and announcements
- **Focus Management**: Proper tab navigation and focus indicators

### 🎨 Visual Design Integration
- **Font Awesome 6.4.0**: Modern icon set with accessibility-focused icons
- **Consistent Styling**: Accessibility controls match existing social media icons
- **Hover States**: Smooth color transitions matching the site's design language
- **Mobile Responsive**: Optimized for all screen sizes with appropriate spacing

## Technical Implementation

### Architecture
- **Jekyll Static Site Generator**: Built on the original Jekyll foundation
- **SCSS Preprocessing**: Enhanced with accessibility-specific variables and mixins
- **Modular JavaScript**: Clean, class-based implementation for accessibility features
- **Progressive Enhancement**: All accessibility features work as enhancements to the base experience

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Web Speech API**: Requires browser support for speech synthesis
- **Fallback Handling**: Graceful degradation for unsupported features

### Performance Considerations
- **Lightweight Implementation**: Minimal impact on page load times
- **Efficient DOM Manipulation**: Optimized JavaScript for smooth interactions
- **CSS Custom Properties**: Modern, performant approach to dynamic styling

## Installation & Setup

### Prerequisites
- Ruby (version 2.7 or higher)
- Jekyll gem
- Bundler gem

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/weslleyanunes/portfolio.git your-site-name
   cd your-site-name
   ```

2. **Install dependencies**:
   ```bash
   bundle install
   ```

3. **Serve locally**:
   ```bash
   bundle exec jekyll serve --watch
   ```
   
   _[Need Jekyll? See installation guide](http://jekyllrb.com/docs/installation/)_

4. **View in browser**:
   Navigate to `http://127.0.0.1:4000`

### Deployment Options

#### GitHub Pages 🚀
Deploy automatically with GitHub Pages using your custom domain or the default `username.github.io/repository` URL. 

#### Custom Domain Setup
You can [configure a custom domain](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/) without complex DNS configuration.

## Customization

### Accessibility Settings
Modify accessibility features in `assets/js/accessibility.js`:
- Adjust font scaling ranges
- Customize TTS language and voice settings  
- Add additional readable content selectors

### Styling Customization
Accessibility-specific styles can be found in:
- `_sass/_variables.scss`: Core accessibility variables
- `_includes/head.html`: Inline CSS for accessibility controls (temporary solution)

### Content Integration
The accessibility features automatically work with:
- All existing content types
- New posts and projects
- Custom page layouts

## File Structure

```
├── assets/
│   └── js/
│       └── accessibility.js     # Main accessibility functionality
├── _includes/
│   └── head.html               # Enhanced with accessibility styles
├── _layouts/
│   └── default.html            # Updated with accessibility controls
├── _sass/
│   ├── _variables.scss         # Accessibility variables added
│   └── ...                     # Original SCSS files preserved
└── README.md                   # This documentation
```

## Contributing

When contributing to this project, please:
1. Respect the original theme's design principles
2. Maintain accessibility standards (WCAG 2.1 AA minimum)
3. Test across multiple browsers and devices
4. Follow the existing code style and documentation patterns

## License

This project maintains the same license as the original theme. Please refer to the `license.txt` file for details.

## Acknowledgments

- **Jami Gibbs**: Original theme author and designer
- **Font Awesome**: Icon library for accessibility controls
- **Web Speech API**: Browser-native text-to-speech functionality
- **Jekyll Community**: Static site generator and ecosystem

---

*This enhanced version preserves the elegant simplicity of the original theme while adding essential accessibility features for a more inclusive web experience.*
