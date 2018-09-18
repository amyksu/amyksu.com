
#
# Default.
#

default: server

#
# Tasks.
#

# Server.
server:
	python -m SimpleHTTPServer \
  `open "http://localhost:8000/docs"`

# Deploy.
deploy:
	./deploy.sh

#
# Phonies.
#

.PHONY: server
.PHONY: deploy
