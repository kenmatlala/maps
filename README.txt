MELO BAKES WEBSITE — COMPLETE RESPONSIVE SITE
=============================================

This ZIP is ready to extract and upload. The main index.html file is at the
TOP LEVEL of the ZIP, with its assets folder beside it. Do not upload only the
HTML file: the assets folder contains the site styling, JavaScript and images.

PROJECT STRUCTURE
-----------------
index.html                 Main website and all page sections
assets/css/styles.css      Responsive styling, layouts and animations
assets/js/main.js          Mobile menu, scroll reveal, gallery, lightbox, form
assets/images/             Logo, favicon, service and corporate images
assets/images/gallery/     15 supplied cake photographs

JAVASCRIPT LOADING
------------------
The script is loaded at the end of index.html using this relative path:
./assets/js/main.js?v=2

Keep the assets folder beside index.html. The script has no external library
or framework dependency. It supports the mobile menu, scroll reveals, gallery
filters, image viewer, previous/next navigation, keyboard arrows, touch swipes
and automatic footer year. A successful load logs:
Melo Bakes: main.js loaded successfully.

HOW TO PREVIEW ON WINDOWS
-------------------------
1. Extract the ZIP file.
2. Open the extracted folder containing index.html.
3. Click the address bar in File Explorer, type cmd and press Enter.
4. Run:

   py -m http.server 8000

5. Open this address in Chrome or Edge:

   http://localhost:8000

You can usually open index.html directly too, but a local server is the better
way to test relative asset paths before uploading.

HOW TO UPLOAD
-------------
Upload index.html and the COMPLETE assets folder to the same website root
folder (often public_html). The result should look like:

public_html/index.html
public_html/assets/css/styles.css
public_html/assets/js/main.js
public_html/assets/images/...

If the website is uploaded into a subfolder, keep the same structure inside
that subfolder and open its index.html.

CONTACT FORM
------------
The form validates the required fields. To send an enquiry, open
assets/js/main.js and set CONTACT_EMAIL to the real Melo Bakes email address.
It then opens the visitor's email application with a prepared message. For
server-side form delivery without an email application, connect Formspree or
another form endpoint.

CONTENT NOTES
-------------
This is a single-page website with linked sections: Home, Services, Corporate
Events, Gallery, Our Approach and Contact. The portfolio collage contains the
15 additional cake images supplied with the project. Corporate event photos
remain a separate lightbox group.
