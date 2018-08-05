commit=$(git ls-remote git://github.com/robinl/open_data_munge.git | awk '{print $1}' | head -n 1)
echo https://raw.githubusercontent.com/RobinL/rdo_code/${commit}/build/rdo_code.js