#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."

tag-release "$root"
create-github-release "$root"
