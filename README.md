# CommonsCloudAdmin

## Overview

The CommonsCloud user interface is intended to help non-developers take advantage of the CommonsCloudAPI by giving them access to all of the functionality the API has to offer through a straight-foward, responsive, web application.


## How To Release

    cp -rf app/vendor/ dist/vendor/ &&
    cp -rf app/styles/fonts/ dist/styles/fonts/ &&
    cp -rf app/images/ dist/images/

    nano dist/index.html (then set scripts and styles to /scripts and /styles)
