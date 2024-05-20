app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

{
    "version": 2,
    "builds": [
      {
        "src": "server.js",
        "use": "@vercel/node",
        "config": { "includeFiles": ["dist/**"] }
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "server.js"
      }
    ]
}