# Advanced Pause for Mainsail

Guided M600 filament changes for Mainsail.

This is my advanced pause script for Mainsail (possibly also compatible with Fluids??). It allows for guided pop-up alerts on run-out and M600 events, with a fluid UI suitable for all screen sizes.

This script is inspired by Jay Lexx's MOM script for for OctoPrint.
## Installation


```bash
STEP 1: Save "adv_pause.cfg" in your config folder (i.e. /config/adv_pause.cfg)
STEP 2: Include it in your printer.cfg (i.e [include adv_pause.cfg])
STEP 3: Override your original index.html in /home/pi/mainsail
OPTIONAL: Tweak any of the default values in [ADVPAUSE_CFG] as required
OPTIONAL: Point your 'runout_gcode' to 'RUN_OUT' in your printer.cfg
```
    
## Screenshots

Run out:

![Run out](https://preview.redd.it/l5pl7p400di91.png?width=485&format=png&auto=webp&s=2c0564893b8bbd541d3067ad58b14f791b7c5cef)

Filament unloading:

![Unloading](https://preview.redd.it/48d8fke10di91.png?width=477&format=png&auto=webp&s=657e21489ed468f0643566a6d0d6e0712439a78d)

M600:

![M600](https://preview.redd.it/zsi5hqp20di91.png?width=645&format=png&auto=webp&s=a45f016b65ce3d0fb45db8014b653ad0c6a29088)

Fluid UI for all screen sizes:

![Mobile](https://preview.redd.it/0ojee3540di91.png?width=720&format=png&auto=webp&s=5a7882473d0d381a4643e206303d2f329ade0219)
