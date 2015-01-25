# NOTE: There are two root files which are the entrypoints to compilation for
# both JavaScript and CSS. Those files are:
#
#   src/js/app.{js,wisp,jsx}
#   src/style/style.scss

# Tools
SHELL := /bin/bash
JSX ?= jsx

# Variables
NODE_ENV ?= development
API_BASE ?= https://api.fremontrobotics.com


# Paths
DIST ?= _dist
BUILD ?= _build
DEV ?= _dev
JS_FILES := $(shell find ./src/js -name '*.js')
JSX_FILES := $(shell find ./src/js -name '*.jsx')
WISP_FILES := $(shell find ./src/js -name '*.wisp')
WISP_MACRO_FILES := $(shell find ./src/wisp-macros -name '*.wisp')
SCSS_FILES := $(shell find ./src/style -name '*.scss')
ASSET_FILES := $(shell find ./src/assets -type f)

# Default target
default: all


# Files

# files for target wisp
$(BUILD)/js/%.js: src/js/%.wisp
	@echo "Compiling wisp: $^."
	@mkdir -p $$(dirname "$@")
	@cat $(WISP_MACRO_FILES) $^ | wisp > $@

# files for target jsx
$(BUILD)/js/%.js: src/js/%.jsx
	@echo "Compiling JSX: $^."
	@mkdir -p $$(dirname "$@")
	@cat $^ | jsx > $@

$(BUILD)/server/%.js: src/server/%.js
	@echo "Copying server js: $^."
	@mkdir -p $$(dirname "$@")
	@cp $^ $@

$(BUILD)/js/%.js: src/js/%.js
	@echo "Copying client js: $^."
	@mkdir -p $$(dirname "$@")
	@cp $^ $@

# files for target js
# TODO: debug?
$(DIST)/static/app.js: jsx wisp $(patsubst ./src/js/%.js,./$(BUILD)/js/%.js,$(JS_FILES))
	@echo "Running browserify."
	@browserify $(BUILD)/js/app.js > $(BUILD)/bundle.js
	@echo "Running envify."
	@NODE_ENV="$(NODE_ENV)" API_BASE="$(API_BASE)" \
	envify $(BUILD)/bundle.js > $(BUILD)/envified.js
	@if [ "$(NODE_ENV)" == "production" ] ; then echo "Running uglify." ; fi
	@if [ "$(NODE_ENV)" == "production" ] ; then ./node_modules/uglify-js/bin/uglifyjs $(BUILD)/envified.js > $@ ; fi
	@if [ "$(NODE_ENV)" != "production" ] ; then cp $(BUILD)/envified.js $@ ; fi

# files for target scss
# NOTE: only the root file is compiled, the rest are included by sass itself
$(DIST)/static/style.css: $(SCSS_FILES)
	@echo "Compiling SCSS."
	@sass src/style/style.scss $(DIST)/static/style.css
	@NODE_ENV="$(NODE_ENV)"
	@if [ "$(NODE_ENV)" == "production" ] ; then cleancss -o $(DIST)/static/mini.css $(DIST)/static/style.css ; fi
	@if [ "$(NODE_ENV)" == "production" ] ; then rm $(DIST)/static/style.css ; fi
	@if [ "$(NODE_ENV)" == "production" ] ; then mv $(DIST)/static/mini.css $(DIST)/static/style.css ; fi

$(DIST)/static/assets/%: src/assets/%
	@echo "Copying asset: $^"
	@mkdir -p $$(dirname "$@")
	@cp $^ $@

node_modules: package.json
	npm install --loglevel error


# Targets

all: html js css assets

jsx: $(patsubst ./src/js/%.jsx,./$(BUILD)/js/%.js,$(JSX_FILES))
wisp: $(patsubst ./src/js/%.wisp,./$(BUILD)/js/%.js,$(WISP_FILES))
assets: $(patsubst ./src/assets/%,./$(DIST)/static/assets/%,$(ASSET_FILES))
js: node_modules $(BUILD)/server/server.js $(DIST)/static/app.js
css: $(DIST)/static/style.css


# Commands

server: all server-only
server-only:
	@echo "Running server."
	@DIST=$(DIST) BUILD=$(BUILD) forever $(BUILD)/server/server.js

dev:
	@echo "Watching for filesystem changes, while running server."
	@DIST="$(DEV)/dist" BUILD="$(DEV)/build" make file-structure
	@DIST="$(DEV)/dist" BUILD="$(DEV)/build" watchr .watchr

clean:
	@echo "Cleaning project."
	@rm -rf $(DIST)/*
	@rm -rf $(BUILD)/*
	@rm -rf $(DEV)/*
	@make file-structure

file-structure:
	@echo "Creating file structure."
	@mkdir -p $(DEV)
	@mkdir -p $(DIST)/static/assets
	@mkdir -p $(BUILD)/js
	@mkdir -p $(BUILD)/server

npm: node_modules

.PHONY: default clean file-structure all server dev deps concat html jsx wisp js server-only assets
