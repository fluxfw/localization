#!/usr/bin/env sh

set -e

bin_folder="`dirname "$0"`"
root_folder="$bin_folder/.."

tag-release "$root_folder"
create-github-release "$root_folder"
