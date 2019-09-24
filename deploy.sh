#!/usr/bin/env bash

env=$1

SERVER_HOST_PROD=139.196.204.78
SERVER_HOST_PREVIEW=111.231.57.84

if [[ $env = "prod" || $env = "preview" ]]; then
  if [[ $env = "preview" ]]; then
    npm run preview
    scp -r  build/index.html root@$SERVER_HOST_PREVIEW:/data/web/mall-admin-static/
    qshell qupload qiniu.conf.test.json
  else
    npm run build
    scp -r  build/index.html root@$SERVER_HOST_PROD:/data/web/mall-admin/
    qshell qupload qiniu.conf.json
  fi
else
  echo '参数不正确!'
  exit 2
fi

