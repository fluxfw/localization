#!/usr/bin/env sh

set -e

root_folder="`dirname "$0"`"

#"$root_folder/lint.sh"

publish-utils-update-release-version "$root_folder"
