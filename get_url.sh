commit=$(git ls-remote git://github.com/robinl/rdo_code | awk '{print $1}' | head -n 1)
echo https://raw.githubusercontent.com/RobinL/rdo_code/${commit}/build/rdo_code.js