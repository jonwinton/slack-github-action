FROM node:10.15.0-slim

LABEL "com.github.actions.name"="Simple Slack Message GitHub Action"
LABEL "com.github.actions.description"="Wraps sending Slack messages to incoming webooks"
LABEL "com.github.actions.icon"="mic"
LABEL "com.github.actions.color"="blue"

LABEL "repository"="https://github.com/jonwinton/slack-github-action"
LABEL "homepage"="https://github.com/jonwinton/slack-github-action"
LABEL "maintainer"="Jon Winton <@jonwinton>"

COPY LICENSE README.md /
COPY "entrypoint.sh" "/entrypoint.sh"
COPY "./src" "/node_scripts"

ENTRYPOINT ["/entrypoint.sh"]
