#!/bin/bash

# this is meant to be run from the root git directory
oldProcess=`ps ax | fgrep node | awk '{print $1}' | sed -n 1p`
kill -15 $oldProcess
sleep 1
kill -2 $oldProcess
sleep 1
kill -9 $oldProcess
sleep 1

make server NODE_ENV=production &

echo 'Server is restarting, you are free to go.'
