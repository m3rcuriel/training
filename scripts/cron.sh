#!/bin/bash

nodeProcess=`ps ax | fgrep node | awk '{print $5}' | sed -n 1p`
if [ $nodeProcess != "node" ]; then
  cd /root/training
  bash scripts/restart.sh
fi
