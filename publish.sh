#!/usr/bin/env sh

set -e

root_folder="`dirname "$0"`"

publish-utils-tag-release "$root_folder"

publish-utils-create-github-release "$root_folder"
