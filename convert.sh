#!/bin/bash
for file in *.tsx
do
  mv "$file" "${file%.tsx}.js"
done