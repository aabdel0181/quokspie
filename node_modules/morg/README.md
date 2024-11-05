# morg
A media organizer tool designed to help keep large media libraries organized by renaming files and folders to a standard (Plex-friendly) format, and cleaning up garbage files.

## Installation
`morg` is designed to be a globally-installed, CLI-based, NodeJS module, so you'll need to [have NodeJS installed](https://nodejs.org/en/download/).

```bash
npm i -g morg
```

## Usage
> NOTE: `morg` has only been tested on MacOS and Linux environments

Start `morg` by navigating to a directory filled with media folders (e.g. movie folders) and invoking it like any other native command or global NodeJS module.

`morg` will scan the directory for sub-folders, and will walk you through a series of prompted questions for each one, gathering the information it needs to properly clean up the files.

```text
❯ morg

Interrogating media folder ... 

./Person.of.Interest.2010.720p.x264-VODO
         |_ (0) Let's.Make.Cool.Shit.URL
         |_ (1) Person.of.Interest.2010.720p.x264-VODO.mkv
         |_ (2) Sintel.2010.720p.x264-VODO
         |_ (3) vodo.nfo

What's the title of this?
Person of Interest

What year was this released?
2010

What quality level is this? [ SD | HD | FHD ]
HD

Is this a BlueRay rip? [ y | n ]
n

Which file is the movie file?
1

Are there any files that should be deleted? (e.g. 0,1,2,3)
0,2,3

Everything look good so far? [ y | n ]
 {
    "title": "Person of Interest",
    "releaseYear": "2010",
    "quality": "HD",
    "isBlueRay": "n",
    "mediaFileIdx": "1",
    "deleteIdxs": "0,2,3"
}
y
====================== CHANGE SUMMARY ======================
Renaming media file: 
         Old:   ./Person.of.Interest.2010.720p.x264-VODO/Person.of.Interest.2010.720p.x264-VODO.mkv
         New:   ./Person.of.Interest.2010.720p.x264-VODO/Person of Interest (2010) (HD).mkv

Renaming media directory: 
         Old:   ./Person.of.Interest.2010.720p.x264-VODO
         New:   ./Person of Interest (2010) (HD)

Deleting files: [
    "./Person.of.Interest.2010.720p.x264-VODO/Let's.Make.Cool.Shit.URL",
    "./Person.of.Interest.2010.720p.x264-VODO/Sintel.2010.720p.x264-VODO",
    "./Person.of.Interest.2010.720p.x264-VODO/vodo.nfo"
]
============================================================

Does the above change summary look OK? [ y | n ]
y
```