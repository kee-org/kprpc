#!/bin/bash
if [ -z "${SKIP_PUBLISH_TO_NPM}" ]
then
	npm publish dist
else
	echo "skipping publish"
fi
