# FED Checklist

This list is meant to assist front-end engineers identify and evaluate aspects of a site that often go overlooked or do not directly affect the end user's experience.

This list is **not** meant to function as a guide to building a website. It assumes that readers understand how to craft quality front-end code and are familiar with best practices. Additions to this list should follow it's authoring guidelines (see below). 

This checklist assumes that you have **[validated your HTML](http://validator.w3.org/#validate_by_input)** and **[linted your JavaScript](http://www.jslint.com)**.

## Checklist

### HTML
- Include Wai Aria Roles 
	- [`banner`](http://www.w3.org/TR/2011/CR-wai-aria-20110118/roles#banner)
	- [`navigation`](http://www.w3.org/TR/2011/CR-wai-aria-20110118/roles#navigation)
	- [`search`](http://www.w3.org/TR/2011/CR-wai-aria-20110118/roles#search)
	- [`main`](http://www.w3.org/TR/2011/CR-wai-aria-20110118/roles#main)
	- [`complementary`](http://www.w3.org/TR/2011/CR-wai-aria-20110118/roles#complementary)
	- [`contentinfo`](http://www.w3.org/TR/2011/CR-wai-aria-20110118/roles#contentinfo)
- Consider adding a 'jump to content' link 
- Consider adding title attributes where helpful/appropriate
- Structure H1-H6 headings (outlining your content)
	- [Chrome Extension: HTML5 Outliner](https://chrome.google.com/webstore/detail/html5-outliner/afoibpobokebhgfnknfndkgemglggomo)
- Include Meta Tags:
  - `<meta charset="utf-8">`
  - `<meta http-equiv="X-UA-Compatible" content="IE=edge">` (Do **not** include `chrome=1`)
  - `<meta name="apple-mobile-web-app-title" content="Site Name">` (for iOS bookmarking)
  - `<meta name="application-name" content="Site Name">` (for Win8 Metro bookmarks)
- Include Favicons
	- [Threespot Wiki: Favicons](http://apps.threespot.com/wiki/index.php/Favicons)

### CSS

- Alphabetize CSS declarations
- Place multiple selectors on their own line
- Consider `:hover`, `:active`, and `:focus` states on links & input elements
- Hyphenate class names (instead of underscore or camel case) 
- Full length class names (avoid abbreviations) 
- Lowercase hex colors
- LTR & RTL comments (if potential for multilingual site)

- [Threespot Wiki: CSS Standards](http://apps.threespot.com/wiki/index.php/CSS_Standards)

### JavaScript

- No-js alternatives for interactive features
- Strict mode
- Consider CDN's to replace local libraries
	- [Google's Hosted Libraries](https://developers.google.com/speed/libraries/)
- Consider jQuery alternatives
	- [Zepto](http://zeptojs.com)
	- [jQuery Builder](http://projects.jga.me/jquery-builder/)
- Search for and remove any `Console.log` tests
- Update any development library builds to production builds
	- [Modernizr](http://modernizr.com/download/)
- Remove RequireJS Cache Buster
	- [Threespot Wiki: RequireJS Cache Buster](http://apps.threespot.com/wiki/index.php/RequireJS#Cache-Busting)

### Testing

- Test in IE's Compatability Mode
- Test on mobile devices (even if non-responsive site)
- Test page weight / performance (both locally & remotely)
	- [SpeedPageTest.org](http://www.webpagetest.org)
- Test w/ a text-based browser 
	- [Lynx](http://lynx.isc.org)
- Test for color contrast issues and colorblindness 
	- [Contrast Ratio](http://leaverou.github.io/contrast-ratio/)
	- [NoCoffee](https://chrome.google.com/webstore/detail/nocoffee/jjeeggmbnhckmgdhmgdckeigabjfbddl?hl=en&gl=US)
- Test tab usage for impaired users
- Test reading tools are correctly grabbing content
	- [Instapaper](http://www.instapaper.com/publishers)
	- [Safari's Native Reader](http://support.apple.com/kb/PH5068?viewlocale=en_US)

### MISC
- Search for and remove any unnecessary comments
- Compress your images
	- [ImageOptim](http://imageoptim.com)
- Save Jpegs as progressive
	- [Progressive Jpegs: A New Best Practice](http://calendar.perfplanet.com/2012/progressive-jpegs-a-new-best-practice/)
- Build production set of Icon Fonts 
	- [[Fontello]](http://fontello.com)
- Consider [schema.org](http://schema.org) integration
- Address Caching
	- [Cache Them if You Can](http://www.stevesouders.com/blog/2012/03/22/cache-them-if-you-can/)
- Include a print style sheet
	- [HTML5 Boilerplate: Print Styles](https://github.com/h5bp/html5-boilerplate/blob/master/css/main.css#L223-L300)
- Consider including a site map
- Consider including [Robots.txt](http://www.robotstxt.org/robotstxt.html)
- Include 403, 404, and 500 pages


## Authoring Guidelines

The important thing to remember is that the items on this list should be the things that have the potential to make it through to production without anyone catching them during the normal process of QA and testing. 

### Additions to this list should:

- **Not** be an obvious best practice. 

	> Examples: "Include an HTML5 Doctype", "Use Em's instead of Px's for font sizing"

	Everyone should know that. Let's not pollute a valuable set of reminders with things we'll all just gloss over. 

- **Not** fail loudly.

	> Examples: "Include alt tags on images", "Fix inline-block in IE7"
	
	Anything that should be discovered in the normal process of thorough testing shouldn't be included. This includes things flagged by the validator or JSLint.


- **Not** be specific to a particular tool or technology. 

	> Example: "Add `og:title, og:description og:url og:type` for Facebook"
	
	If someone is embracing a specific technology, they are responsible for testing for it's ramifications. Let's not put a bunch of edge-case fixes in here.
	
- Include links to helpful tools and articles when appropriate and available.