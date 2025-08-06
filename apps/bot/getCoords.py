from pynput import keyboard
import time

print("Press Numpad 3 to print the current mouse position.")
print("Press Ctrl+C to stop the script.")

from pynput.mouse import Controller
mouse = Controller()

# Define the key press handler
def on_press(key):
    try:
        # Numpad 3 has a keycode of 99 on many systems
        if hasattr(key, 'vk') and key.vk == 99:
            pos = mouse.position
            print(f"Numpad 3 pressed at: x={pos[0]}, y={pos[1]}")
    except AttributeError:
        pass

# Set up the keyboard listener
listener = keyboard.Listener(on_press=on_press)

try:
    listener.start()
    while True:
        time.sleep(0.1)  # Sleep to reduce CPU usage
except KeyboardInterrupt:
    print("\nScript stopped by user.")
    listener.stop()
    listener.join()
