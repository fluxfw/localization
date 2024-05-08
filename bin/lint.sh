#!/usr/bin/env sh

set -e

bin_folder="`dirname "$0"`"
root_folder="$bin_folder/.."

js-lint "$root_folder"
