# Local PlantUML Provider

![GitHub package.json version](https://img.shields.io/github/package-json/v/joethei/obsidian-local-plantuml)
![GitHub manifest.json dynamic (path)](https://img.shields.io/github/manifest-json/minAppVersion/joethei/obsidian-local-plantuml?label=lowest%20supported%20app%20version)
![GitHub](https://img.shields.io/github/license/joethei/obsidian-local-plantuml)
[![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)

Render [PlantUML](https://plantuml.com) Diagrams in [Obsidian](https://obsidian.md) locally

---

> ⚠️No longer in use, this functionality has been added to the main plugin


This plugin works together with the [PlantUML](https://github.com/joethei/obsidian-plantuml) plugin and adds the ability to render diagrams locally.

This plugin requires you to have a plantUML `.jar` downloaded to your system as well as a version of 
Java installed.
You can get the PlantUML `.jar` from [here](https://plantuml.com/de/download)

Once this plugin is enabled you will have a new option to configure the path to your `.jar` file.

Keep in mind that this plugin only works on desktop and the main PlantUML plugin
defaults to requesting images from the remote server, if this plugin is not installed.

This plugin works by calling the `.jar` file every time a render is initiated,
this can take up considerable resources depending on your system and the diagram.
If you feel a slow down when using the plugin, consider increasing the debounce time in the plugin
settings.
