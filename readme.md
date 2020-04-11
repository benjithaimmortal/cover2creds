# For Ian George: may we continue to make beautiful things.


This site interfaces a few things that you might want to peek at.


### Rellax took a load off
First off, there's rellax.js giving us nice smooth parallaxy images. Beautiful.


### Podbean is sprouting into quite a complex integration
Next, and possibly more hacky, Podbean is not a friendly embed API. They embed in an iframe (eww) and do not provide many fields at all. I had to break into the RSS feed with a 20 year old XMLHttpRequest() and cipher that down to provide dynamic descriptions and dates.

Dates! Don't get me started with dates. These dates are formatted as a text string in the RSS XML. I just split them on space characters and rearranged them at will.



**Important Note**
- GitHub Pages is currently serving this on a side url `/cover2creds`
- `{{ site.baseurl }}` is set to all internal urls so I don't have to type that a billion times.
- This means you might need to use `bundle exec jekyll s --baseurl ''` when you're doing that localhost servy thing to set the baseurl to an empty string (instead of the baseurl that is set in `config.yml`).