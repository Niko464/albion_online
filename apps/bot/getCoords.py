from pynput import mouse

print("Click anywhere on the screen to get the x, y coordinates.")
print("Press Ctrl+C to stop the script.")

# Define the mouse click handler
def on_click(x, y, button, pressed):
    if pressed:
        print(f"Clicked at: x={x}, y={y}")

# Set up the mouse listener
listener = mouse.Listener(on_click=on_click)

try:
    # Start the listener
    listener.start()
    listener.wait()  # Wait for the listener to start
    while True:
        pass  # Keep the script running
except KeyboardInterrupt:
    print("\nScript stopped.")
    listener.stop()