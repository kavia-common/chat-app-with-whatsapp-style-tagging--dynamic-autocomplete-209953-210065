#!/bin/bash
cd /home/kavia/workspace/code-generation/chat-app-with-whatsapp-style-tagging--dynamic-autocomplete-209953-210065/FrontendWebApplication
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

