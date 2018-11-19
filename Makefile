
#
# Default.
#

default: server

#
# Tasks.
#

# Server.
server:
	@python3 -m http.server \
  `open "http://localhost:8000/docs"`

# Deploy.
deploy:
	./deploy.sh

# Build.
build:
	@node ./build.js

# Install.
install: node_modules
node_modules: package.json
	@npm install
	@touch node_modules

#
# Phonies.
#

.PHONY: server
.PHONY: deploy
.PHONY: build
