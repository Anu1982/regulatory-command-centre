# Dev Container

Boots a GitHub Codespace (or a local VS Code Dev Container) that automatically
serves the demo on **port 8080** and opens a preview.

## What it does

- Uses the Microsoft **universal:2-linux** image (Python and Node preinstalled).
- Runs `python3 -m http.server 8080` in the `demo/` folder on attach.
- Forwards port `8080` publicly and opens the Simple Browser preview.
- Preinstalls a small set of helpful VS Code extensions.

## How to open a Codespace

1. Push this repository to GitHub (see the root `README.md` if you have not yet).
2. On the GitHub repo page, click **Code** → **Codespaces** → **Create codespace on main**.
3. Wait for the container to build (~2 minutes on first launch).
4. The demo starts automatically. The Ports tab shows a `https://…-8080.app.github.dev`
   URL you can share.

## How to open it locally (Dev Containers)

1. Install the *Dev Containers* extension in VS Code.
2. Run **Dev Containers: Reopen in Container** from the command palette.
3. Once attached, the same server starts on `http://localhost:8080`.

## Troubleshooting

- If the preview does not open automatically, click the **Ports** tab and use the
  globe icon next to port 8080.
- If the server terminal is closed, reopen a terminal and run:
  ```bash
  cd demo && python3 -m http.server 8080
  ```
