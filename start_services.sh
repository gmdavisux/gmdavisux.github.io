
#!/bin/bash

# Start Apache
sudo apachectl start

# Navigate to your Jekyll site directory
cd /Users/garydavis/Sites/gmdavisux.github.io

# Start Jekyll
bundle exec jekyll serve

