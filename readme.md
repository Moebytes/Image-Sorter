# Image Sorter

A faster personal tool to sort images. This is because it's a pain to make sense of finder's small thumbnails, 
as well as it being easy to lose your selection by misclicking. 

This was slightly modified from [Image Viewer](https://github.com/Moebytes/Image-Viewer)

Set the environmental variable FOLDER to the base folder containing folders of images you want to sort. This is optimized for sorting images from pixiv, and 
as such it generally expects numeric filenames that may end in _p*. 

### Qualifier reference
- `_p` - For single posts, or to join images together as variations
- `_c` - Adds images as child posts to the first image in this set 
- `_c!` - Joins the image as a variation to the last child post
- `_g` - Uploads images seperately but adds them to the same group
- `_g!` - Adds the image as a variation to the last grouped post

### Special attributes
Attributes added to the filename to categorize correctly or add certain tags. Most commonly comic, 
colored-comic, chibi, sketch, lineart, and text

### Alt source
This changes the "alt source" of that image... in the case of wanting to group several posts together to the same pixiv id 
(because they are very similar) but in actuality the source is a different pixiv post.

Reordering the images and arbitrary renaming isn't supported and has to be done manually

Instructions to start: \
`npm install` (only run the first time) \
`npm start`

<img src="assets/images/readme.png">
