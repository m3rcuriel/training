#!/bin/bash

nodeProcess=`ps ax | fgrep node | awk '{print $1}' | sed -n 1p`
if [ ! $nodeProcess ]; then
  cd /root/training
  bash scripts/restart.sh
fi
