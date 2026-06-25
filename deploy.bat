@echo off
echo Deploying to GitHub and Vercel...
git remote add origin https://github.com/vikassangwal/automata-labs.git 2>nul
git branch -M main
git push -u origin main --force
echo.
echo ==============================================
echo Deployment code sent to GitHub!
echo Vercel will automatically update in a minute.
echo ==============================================
pause
