#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."

flux-js-lint "$root"
