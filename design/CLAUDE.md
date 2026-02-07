# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Axure RP prototype export** for a computing power marketplace (算力超市demo - "Computing Power Supermarket"). The project is a static HTML prototype with no build system or package manager.

## Architecture

### Entry Points

- **[index.html](index.html)** - Main prototype viewer container with top panel interface and iframe for loading pages
- **[start.html](start.html)** and **[start_with_pages.html](start.html)** - Alternative entry points for different preview modes

### Site Structure

The site structure is defined in **[data/document.js](data/document.js)**, which contains:
- Page hierarchy and navigation configuration
- Global styling definitions
- Custom style classes (标题, 文本段落, 形状, etc.)

### Page Organization

Each page follows this structure:

```
{pageName}.html          # Page HTML file
├── files/{pageName}/    # Page-specific assets
│   ├── data.js          # Page data and widget definitions
│   └── styles.css       # Page-specific styles
└── images/{pageName}/   # Page-specific images (PNG, SVG)
```

#### Main Pages

| Page | HTML File | Description |
|------|-----------|-------------|
| 首页 | [首页.html](首页.html) | Homepage |
| 智算专区 (folder) | | Intelligent Computing Zone |
| ├─ GPU裸金属 | [gpu裸金属.html](gpu裸金属.html) | GPU Bare Metal |
| ├─ 智算一体机 | [智算一体机.html](智算一体机.html) | Intelligent Computing Appliance |
| ├─ GPU云主机 | [gpu云主机.html](gpu云主机.html) | GPU Cloud Host |
| └─ MaaS平台 | [maas__.html](maas__.html) | MaaS Platform |
| 通算专区 | [通算专区.html](通算专区.html) | General Computing Zone |
| 解决方案 (folder) | | Solutions |
| ├─ 解决方案首页 | [解决方案首页.html](解决方案首页.html) | Solutions Home |
| ├─ 解决方案-算力服务平台 | [解决方案-算力服务平台.html](解决方案-算力服务平台.html) |
| ├─ 解决方案-算力网络体系 | [解决方案-算力网络体系.html](解决方案-算力网络体系.html) |
| └─ 解决方案-算力融合底座 | [解决方案-算力融合底座.html](解决方案-算力融合底座.html) |

### Shared Resources

- **[resources/css/](resources/css/)** - Shared stylesheets
  - `axure_rp_page.css` - Core Axure page styles
  - `default.css` - Global default styles
  - `jquery-ui-themes.css` - jQuery UI theme styles

- **[resources/scripts/](resources/scripts/)** - Shared JavaScript
  - `jquery-3.2.1.min.js` - jQuery library
  - `axure/` - Axure framework scripts (events, actions, visibility, etc.)
  - `player/` - Prototype player scripts

- **[plugins/](plugins/)** - Axure extensions
  - `sitemap/` - Page navigation
  - `page_notes/` - Documentation notes
  - `debug/` - Debugging tools
  - `recordplay/` - Recording and playback

## Working with This Prototype

### Editing Styles
- Global styles: Edit [resources/css/default.css](resources/css/default.css)
- Page-specific styles: Edit `files/{pageName}/styles.css`
- Style classes are defined in [data/document.js](data/document.js) (customStyles object)

### Editing Content
- Page content is embedded in individual HTML files
- Page data (widgets, interactions) is in `files/{pageName}/data.js`
- Text content uses Chinese encoding (UTF-8 with BOM)

### Viewing the Prototype
- Open [index.html](index.html) in a browser for the full prototype viewer experience
- Use individual HTML files for direct page access without the viewer interface

## Important Notes

- All HTML files use **UTF-8 with BOM** encoding
- Line endings are **CRLF** (Windows-style)
- The prototype uses **jQuery 3.2.1** (older version)
- No build process or development server is required - this is a static prototype
- Changes to [data/document.js](data/document.js) affect the entire prototype structure
