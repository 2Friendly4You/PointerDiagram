package de.tobiasrick.pointerdiagram.pointer;

import javafx.scene.canvas.GraphicsContext;
import javafx.scene.paint.Color;

/**
 * A class for the canvas that can draw ExtensionPointers. These are added to a BasePointer as an extension
 *
 * @author Tobias Rick
 */
public class ExtensionPointer extends Pointer{
    public ExtensionPointer(GraphicsContext gc, double x1, double y1, double x2, double y2) {
        super(gc, x1, y1, x2, y2);
    }

    public ExtensionPointer(GraphicsContext gc, double x1, double y1, double x2, double y2, Color strokeColor, Color fillColor) {
        super(gc, x1, y1, x2, y2, strokeColor, fillColor);
    }
}
