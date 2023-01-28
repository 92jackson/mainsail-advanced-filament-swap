# Advanced Filament Swap for Mainsail
## Guided M600 filament changes and filament run-outs for Mainsail.

This is my advanced filament swap script for Mainsail (possibly also compatible with Fluids??). It allows for guided pop-up alerts on run-out and M600 events, with a fluid UI suitable for all screen sizes.

This script is inspired by Jay Lexx's MOM script for for OctoPrint.

## Preview
[YouTube](https://youtu.be/61uj0Wp03IY)

[Screenshots](#screenshots)

## Changes
Some people had issues with replacing their index.html with the modified version I provided. It appears that from time to time Mainsail update the source for it and if it then gets replaced with a mismatched version, it causes a blank screen. The new method instead requires the user to edit their own index.html and paste in a few extra lines (see installation instructions below).

## Installation
```bash
STEP 1: Connect to your printer via SFTP
STEP 2: Save adv_filament_swap.cfg in your config folder (i.e: home/pi/klipper_config/)
STEP 3: Save alert-handler.js in /home/pi/mainsail
STEP 4: Edit your index.html in /home/pi/mainsail and add the following before </head>

	<!-- MOD START -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
		<script src="./alert-handler.js"></script>
	<!-- MOD END -->

STEP 5: Include this script in your printer.cfg (i.e [include adv_filament_swap.cfg])
OPTIONAL: Tweak any of the default values in adv_filament_swap.cfg as required (from line #120)
OPTIONAL: Point your run-out pin to RUN_OUT in your printer.cfg
```

## Usage (example given for Cura)
```bash
STEP 1) Extensions > Post Processing > Modify G-Code
STEP 2) Add a script -> Filament Change
STEP 3) Set "Layer" to the layer number you want the switch to occur
STEP 4) Repeat Step 3 for however many changes you require (:

N.B. You can also manaually send FILAMENT_SWAP in the console to trigger a filament swap.
```


## Support
For support, join my [Discord](https://discord.gg/e3eXGTJbjx).

Like to support my work or say thanks?

[![paypal](https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate/?hosted_button_id=9QZ34DQCEPAGG)

    
## Screenshots

Run out:

![Run out](https://preview.redd.it/l5pl7p400di91.png?width=485&format=png&auto=webp&s=2c0564893b8bbd541d3067ad58b14f791b7c5cef)

Filament unloading:

![Unloading](https://preview.redd.it/48d8fke10di91.png?width=477&format=png&auto=webp&s=657e21489ed468f0643566a6d0d6e0712439a78d)

M600:

![M600](https://preview.redd.it/zsi5hqp20di91.png?width=645&format=png&auto=webp&s=a45f016b65ce3d0fb45db8014b653ad0c6a29088)

Fluid UI for all screen sizes:

![Mobile](https://preview.redd.it/0ojee3540di91.png?width=720&format=png&auto=webp&s=5a7882473d0d381a4643e206303d2f329ade0219)
