import os
import threading

from PIL import Image, ImageDraw, ImageFont
from StreamDeck.DeviceManager import DeviceManager
from StreamDeck.ImageHelpers import PILHelper

import paho.mqtt.client as mqtt
import json

# Folder location of image assets
ASSETS_PATH_IMAGES = os.path.join(os.path.dirname(__file__), "Assets/images")
ASSETS_PATH_FONTS = os.path.join(os.path.dirname(__file__), "Assets/fonts")


# Generates a custom tile with run-time generated text and custom image via the
# PIL module.
def render_key_image(deck, icon_filename, font_filename, label_text):
    # Resize the source image asset to best-fit the dimensions of a single key,
    # leaving a margin at the bottom so that we can draw the key title
    # afterwards.
    icon = Image.open(icon_filename)
    image = PILHelper.create_scaled_image(deck, icon, margins=[0, 0, 20, 0])

    # Load a custom TrueType font and use it to overlay the key index, draw key
    # label onto the image a few pixels from the bottom of the key.
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype(font_filename, 10)
    draw.text((image.width / 2, image.height - 5), text=label_text, font=font, anchor="ms", fill="white")

    return PILHelper.to_native_format(deck, image)


# Returns styling information for a key based on its position and state.
def get_key_style(deck, key, state):
    # Last button in the example application is the exit button.
    exit_key_index = deck.key_count() - 1

    data = openJSON()
    print("key: ", key)

    if key == exit_key_index:
        name = data[key]["name"]
        icon = data[key]["image"]
        font = "Roboto-Regular.ttf"
        label = data[key]["label"]
    else:
        name = data[key]["name"]
        icon = data[key]["image"]
        font = "Roboto-Regular.ttf"
        label = data[key]["label"]
    
    print("name:", name,"icon:", os.path.join(ASSETS_PATH_IMAGES, icon),"font: ", os.path.join(ASSETS_PATH_FONTS, font),"label:", label)
    return {
        "name": name,
        "icon": os.path.join(ASSETS_PATH_IMAGES, icon),
        "font": os.path.join(ASSETS_PATH_FONTS, font),
        "label": label
    }


# Creates a new key image based on the key index, style and current key state
# and updates the image on the StreamDeck.
def update_key_image(deck, key, state):
    # Determine what icon and label to use on the generated key.
    key_style = get_key_style(deck, key, state)

    # Generate the custom key with the requested image and label.
    image = render_key_image(deck, key_style["icon"], key_style["font"], key_style["label"])

    # Use a scoped-with on the deck to ensure we're the only thread using it
    # right now.
    with deck:
        # Update requested key with the generated image.
        deck.set_key_image(key, image)


# Prints key state change information, updates rhe key image and performs any
# associated actions when a key is pressed.
def key_change_callback(deck, key, state):
    # Print new key state
    print("Deck {} Key {} = {}".format(deck.id(), key, state), flush=True)

    # Update the key image based on the new key state.
    update_key_image(deck, key, state)

    # Check if the key is changing to the pressed state.
    if state:
        key_style = get_key_style(deck, key, state)

        client.publish("homeauto/streamdeck/output", key)

        # When an exit button is pressed, close the application.
        if key_style["name"] == "exit":
            # Use a scoped-with on the deck to ensure we're the only thread
            # using it right now.
            with deck:
                # Reset deck, clearing all button images.
                deck.reset()

                # Close deck handle, terminating internal worker threads.
                deck.close()

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe("homeauto/streamdeck/control/#")

def on_message(client, userdata, msg):
    print("")


def openJSON():
    with open('config.json') as json_file:
        data = json.load(json_file)

        print("Type: ", data)

        return data


if __name__ == "__main__":
    client = mqtt.Client()
    client.username_pw_set(username='',password='')
    client.connect_async("192.168.178.133", 1883, 60)
    client.on_connect = on_connect
    client.on_message = on_message
    client.loop_start()


    streamdecks = DeviceManager().enumerate()

    print("Found {} Stream Deck(s).\n".format(len(streamdecks)))

    for index, deck in enumerate(streamdecks):
        # This example only works with devices that have screens.
        if not deck.is_visual():
            continue

        deck.open()
        deck.reset()

        print("Opened '{}' device (serial number: '{}', fw: '{}')".format(
            deck.deck_type(), deck.get_serial_number(), deck.get_firmware_version()
        ))

        # Set initial screen brightness to 30%.
        deck.set_brightness(30)

        # Set initial key images.
        for key in range(deck.key_count()):
            update_key_image(deck, key, False)

        # Register callback function for when a key state changes.
        deck.set_key_callback(key_change_callback)

        # Wait until all application threads have terminated (for this example,
        # this is when all deck handles are closed).
        for t in threading.enumerate():
            try:
                t.join()
            except RuntimeError:
                pass