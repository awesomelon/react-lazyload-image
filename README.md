# react-lazyload-image

A lightweight and efficient React component that automatically loads images when they enter the viewport, improving performance by reducing initial page load time.

## Features

- 🚀 **Lazy Loading**: Loads images only when they enter the viewport.
- 🖼️ **Placeholder Support**: Displays a placeholder image before the actual image loads.
- 🔄 **Intersection Observer**: Utilizes the native `IntersectionObserver` API for efficient detection.
- 📦 **Lightweight**: No additional dependencies beyond React.
- 📱 **Responsive**: Works seamlessly across all devices and screen sizes.

## Installation

```bash
npm install react-lazyload-image
# or
yarn add react-lazyload-image
```

## Usage

```tsx
import React from 'react';
import LazyImage from 'react-lazyload-image';

function App() {
  return (
    <div className='app'>
      <h1>Lazy Loading Images Example</h1>

      <LazyImage
        src='https://example.com/large-image.jpg'
        alt='Lazy loaded image'
        placeholderSrc='https://example.com/small-placeholder.jpg'
        width={800}
        height={600}
        threshold={0.5}
      />
    </div>
  );
}

export default App;
```

## Props

| Prop           | Type   | Description                                           | Default             |
| -------------- | ------ | ----------------------------------------------------- | ------------------- |
| placeholderSrc | string | Placeholder image to show before the main image loads | Transparent 1x1 GIF |
| threshold      | number | Threshold for the IntersectionObserver (optional)     | 0.1                 |

## Browser Support

This component works in all modern browsers that support the IntersectionObserver API. For older browsers like IE11, consider using a polyfill.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [j-ho](https://github.com/awesomelon)

`This README provides a clear and professional overview of the `react-lazyload-image` library, including its purpose, features, installation instructions, usage example, supported props, browser compatibility, and licensing information. Let me know if you need any further adjustments!`
