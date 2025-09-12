<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Equipment</title>
  @viteReactRefresh
  @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
  <div id="equipment-root"></div>
  <script>
    setTimeout(() => {
      if (window.React && window.ReactDOM && window.Equipment) {
        const root = ReactDOM.createRoot(document.getElementById('equipment-root'));
        root.render(React.createElement(window.Equipment));
      }
    }, 100);
  </script>
  </body>
 </html>


