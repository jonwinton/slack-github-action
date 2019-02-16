FROM alpine:latest

LABEL "com.github.actions.name"="Post To Slack Webhook"
LABEL "com.github.actions.description"="Post Slack messages to an incoming webhook endpoint"
LABEL "com.github.actions.icon"="hash"
LABEL "com.github.actions.color"="blue-dark"

LABEL "repository"="https://github.com/jonwinton/slack-github-action"
LABEL "homepage"="https://github.com/jonwinton/slack-github-action"
LABEL "maintainer"="Jon Winton <@jonwinton>"

RUN apk update \
  && apk add curl gettext libintl \
  && mv /usr/bin/envsubst /usr/local/bin/envsubst \
  && apk del gettext \
  && rm -rf /var/cache/apk/* \
  && rm -rf /tmp/*

COPY LICENSE README.md /
COPY "entrypoint.sh" "/entrypoint.sh"

ENTRYPOINT ["/entrypoint.sh"]
