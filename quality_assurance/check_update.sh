#!/bin/bash

SCRIPT_DIR=$(dirname $0)

for pscript in `find ${SCRIPT_DIR}/original -name "*.js"`; do
	ORIGINAL=`dirname $pscript`/`basename $pscript .js`.original
	phantomjs $pscript | diff $ORIGINAL -
done
