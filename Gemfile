source 'https://rubygems.org'

gem "jekyll", "~> 4.3.3" # installed by `gem jekyll`
# gem "webrick"        # required when using Ruby >= 3 and Jekyll <= 4.2.2
gem "minima", "~> 2.5"

group :jekyll_plugins do
    gem "jekyll-feed", "~> 0.12"
end

gem "just-the-docs", "0.8.1" # pinned to the current release
# gem "just-the-docs"        # always download the latest release

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]