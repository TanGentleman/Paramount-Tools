# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Bugs

## [Unreleased]
- Work within typescript implementation, then convert to js to utilize content.js script.

## [1.1.1] - 2023-October

### Added
- Subtitles menu UI replaced with a "toggle" button.
    - This button automates the selection process for subtitles (English/Off).
- Add several buttons for improved user experience:
    - `Next` to skip to next episode
    - `Previous` to play previous episode
    - `Speed` to change playback speed (1x, 1.25x, 1.5x)

### Fixed
- Sometimes player is not "clicked to completion" and video stalls.
- Play button detection is now consistent.
- Duplicate script injection is now prevented.

### Changed

- Things I've changed...

### Removed

- Things I've removed...
