<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>iREPLY - View Request</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <script>window.APP_BASE_URL = "{{ url('/') }}";</script>
</head>
<body class="antialiased">
    <div id="viewrequest-root"></div>
    <script>
      setTimeout(() => {
        try {
          if (window.React && window.ReactDOM && window.ViewRequest) {
            const root = ReactDOM.createRoot(document.getElementById('viewrequest-root'));
            root.render(React.createElement(window.ViewRequest));
          }
        } catch (e) {
          console.error('Error rendering ViewRequest:', e);
        }
      }, 200);
    </script>
</body>
</html>


