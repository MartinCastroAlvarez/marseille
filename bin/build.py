"""
RENDER
This script is responsible for rendering the web app.
"""

import os
import json
import glob
import shutil
import random
import typing
import collections

import yaml
from htmlmin.main import minify
from jinja2 import Environment, FileSystemLoader, select_autoescape

# ROOT DIRECTORY
# Getting current working directory.
ROOT: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print(f'Root directory: {ROOT}')

# CONFIGURATION
# Loading application configuration
CONFIG: str = os.path.join(ROOT, 'config.yaml')
print(f'Config file: {CONFIG}')
if not os.path.isfile(CONFIG):
    raise OSError(CONFIG)
with open(CONFIG, 'r') as file_handler:
    config: dict = yaml.full_load(file_handler)

# Loading configuration file.
SECRETS: str = os.path.join(os.environ['HOME'], ".marseille")
if not os.path.isfile(SECRETS):
    raise RuntimeError("Invalid config file.", SECRETS)
with open(SECRETS) as file_handler:
    secrets: dict = json.load(file_handler)

# WEB DIRECTORY
# Getting web source directory.
WEB: str = os.path.join(ROOT, config['Build']['Templates'])
print(f'Web directory: {WEB}')
if not os.path.isdir(WEB):
    raise OSError(WEB)

# BUILD DIRECTORY
# Getting web build directory.
BUILD: str = os.path.join(ROOT, config['Build']['Package'])
print(f'Build directory: {BUILD}')
if os.path.isdir(BUILD):
    print(f'Cleaning existing build directory: {BUILD}')
    shutil.rmtree(BUILD)
os.mkdir(BUILD)

# JINJA ENVIRONMENT
# Setting up Jinja2.
jinja: Environment = Environment(
    loader=FileSystemLoader(WEB),
    autoescape=select_autoescape(['html', 'xml'])
)

# RECOMMENDER SYSTEM
# Shuffling content to provide novelty.
# https://stackoverflow.com/questions/31607710
def recommend(data: dict) -> typing.Generator[typing.Tuple[str, list], None, None]:
    """
    Recommender System.
    """
    keys: list = list(data.keys())
    random.shuffle(keys)
    for key in keys:
        values: list = data[key]
        random.shuffle(values)
        yield key, values
jinja.filters['recommend'] = recommend

# ASSETS DIRECTORY
# Getting web source directory.
MEDIA: str = os.path.join(ROOT, config['Build']['Media'])
print(f'Media directory: {MEDIA}')
if not os.path.isdir(MEDIA):
    raise OSError(MEDIA)

# MULTI-LANGUAGE
# Iterating over each supported language and rendering a new static app.
for language in config['Language'].values():

    # LANGUAGE SUBDIRECTORY
    # Creating building directory.
    build: str = os.path.join(BUILD, language['Code'])
    os.mkdir(build)

    # APPLICATION CONTEXT
    # Loading variables that are available to all templates.
    context: dict = {
        "application": config['Application'],
        "url": secrets['url'],
        "style": config['Style'],
        "assets": config['Assets'],
        "link": config['Link'],
        "language": config['Language'],
        "categories": config['Categories'],
        "strings": {
            k: v[language['Code']]
            for k, v in config['Strings'].items()
        }
    }

    # RENDERING WEB VIEWS
    # Rendering and minifying all web views.
    # https://stackoverflow.com/questions/13587531
    # https://stackoverflow.com/questions/2212643
    os.chdir(WEB)
    for filename in glob.iglob("**", recursive=True):
        if os.path.isdir(filename):
            # DIRECTORIES
            # Creating a directory on the build directory.
            os.mkdir(os.path.join(build, filename))
        elif filename.endswith('.layout.html'):
            # LAYOUT
            # Ignoring build components.
            pass
        elif filename.split(".")[-1] in {"html", "css", "webmanifest", "js"}:
            # STATIC CONTENT
            # Rendering HTML, CSS and JS files.
            target: str = os.path.join(build, filename)
            print(f'Web template: {filename}')
            template: str = jinja.get_template(filename)
            html: str = template.render(**context)
            html: str = html if filename.endswith(".js") else minify(html)
            with open(target, 'w') as file_handler:
                file_handler.write(html)
            print(f'Web page rendered: {target}')
        else:
            # MEDIA CONTENT
            # Rendering images, audio and video.
            source: str = os.path.join(WEB, filename)
            target: str = os.path.join(build, filename)
            print(f'Adding media: {source}')
            shutil.copy2(source, target)

    # COPYING ASSETS
    # Copying assets into the media folder.
    os.chdir(MEDIA)
    os.mkdir(os.path.join(build, "assets"))
    for filename in glob.iglob("**", recursive=True):
        print(f'Media file: {filename}')
        if os.path.isdir(filename):
            os.mkdir(os.path.join(build, 'assets', filename))
        else:
            shutil.copy2(filename, os.path.join(build, 'assets', filename))

# THE END
print(f'Web built successfully!')
