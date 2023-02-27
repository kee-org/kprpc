#!/bin/bash
if [ -z "${SKIP_PUBLISH_TO_NPM}" ]
then
	cd dist && npm publish
else
	echo "skipping publish"
fi
