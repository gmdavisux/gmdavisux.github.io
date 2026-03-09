
#!/bin/bash

# Start Apache
sudo apachectl start

# Navigate to your Jekyll site directory
cd /Users/garydavis/Sites/gmdavisux.github.io

# Start Jekyll with dev config to avoid CORS issues locally
bundle exec jekyll serve --config _config.yml,_config_dev.yml

