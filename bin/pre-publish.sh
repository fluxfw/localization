#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."

#"$bin/lint.sh"

update-release-version "$root"
