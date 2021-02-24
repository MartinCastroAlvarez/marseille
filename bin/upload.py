"""
UPLOAD
This script is responsible for uploading the web app to AWS S3.
"""

import os
import json
import glob
import mimetypes
import hashlib

import yaml
import botocore.exceptions
import boto3

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

# BUILD DIRECTORY
# Getting web build directory.
BUILD: str = os.path.join(ROOT, config['Build']['Package'])
print(f'Build directory: {BUILD}')
if not os.path.isdir(BUILD):
    raise OSError(BUILD)

# AWS S3 Profile
# Getting AWS Profile
profile: str = secrets['profile']
if not profile:
    raise ValueError("Missing AWS profile.")
os.environ['AWS_PROFILE'] = profile
print(f'AWS Profile: {profile}')

# BUCKET NAME
# Getting AWS S3 bucket name.
bucket: str = secrets['bucket']
print(f'AWS S3 Bucket: {bucket}')

# AWS S3 CONNECTION
# Initializing connection with AWS S3.
s3: boto3.client = boto3.client('s3')

# UPLOADING BUILD
# Uploading web app to AWS S3.
os.chdir(BUILD)
for filename in glob.iglob('**', recursive=True):

    # DIRECTORY
    # Ignoring directories. S3 only accepts files.
    if not os.path.isfile(filename):
        continue

    # CHECKSUM
    # Calculating MD5 Checksum of Local File.
    # https://stackoverflow.com/questions/16874598
    with open(filename, 'rb') as file_handler:
        local_md5: str = hashlib.md5(file_handler.read()).hexdigest()

    # CHECKSUM
    # Calculating MD5 Checksum of Uploaded File
    # https://stackoverflow.com/questions/26415923
    try:
        remote_md5: str = s3.head_object(Bucket=bucket,
                                         Key=filename)['ETag'][1:-1]
    except botocore.exceptions.ClientError:
        remote_md5: str = ""

    # CHECKSUM
    # Avoid upload the same file twice.
    if remote_md5 and remote_md5 == local_md5:
        print(f'Already uploaded: {filename}')
        continue

    # MIMETYPE
    # Reading the file mimetype to avoid the file being downloaded.
    mime: str = mimetypes.MimeTypes().guess_type(filename)[0]
    print(f'Mime Type: {mime}')

    # UPLOADING
    # Uploading file with correct mimetype.
    print(f'Uploading file: {filename}')
    s3.upload_file(filename, bucket, filename, ExtraArgs={
        'ContentType': mime or 'text',
    })

# THE END
print(f'Web uploaded successfully!')
