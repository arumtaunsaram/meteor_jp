#!/bin/bash

SCRIPT_DIR=$(dirname $0)
FIRST_FLAG=$1

if [ "$FIRST_FLAG" == "update" ]; then
	echo "You gave 'update' option, it will overwrite the existing .original files. Continue? [Y/n]: "
	read -r input

	if [ ! "$input" == "Y" ]; then
		exit 0
	fi
fi


for pscript in `find ${SCRIPT_DIR}/original -name "*.js"`; do
	ORIGINAL=`dirname $pscript`/`basename $pscript .js`.original
	echo $ORIGINAL
	if [ "$FIRST_FLAG" == "update" ]; then
		phantomjs $pscript > $ORIGINAL
	else
		phantomjs $pscript | diff -C 3 $ORIGINAL -
	fi
done
