#!/bin/bash
echo "Running flake8 tests."
ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
export PYTHONPATH="$ROOT/../app/"
flake8\
    --max-line-length 100 \
    --max-complexity 10 \
    --exclude ".serverless node_modules geograpy" \
    $ROOT/../app/
if [ $? != 0 ]
then
    echo "ERROR: Flake8 failed."
    exit 1824
fi
echo "Flake8 passed!"
