#!

echo Killing node...
taskkill /f /im node.exe
echo Done.

trap "echo Killing node...; taskkill /f /im node.exe; echo Done. ; exit 0" SIGINT SIGTERM

while :
do
  echo "Top of the morning to you..."
  npm run dev || exit
  echo "Good evening."
done
