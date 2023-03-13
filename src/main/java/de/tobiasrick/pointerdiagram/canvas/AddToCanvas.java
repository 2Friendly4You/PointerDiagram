package de.tobiasrick.pointerdiagram.canvas;

import de.tobiasrick.pointerdiagram.ExtensionPointerAdderWindow;
import de.tobiasrick.pointerdiagram.pointer.BasePointer;
import de.tobiasrick.pointerdiagram.pointer.ExtensionPointer;
import de.tobiasrick.pointerdiagram.pointer.Pointer;
import javafx.scene.control.ToolBar;
import javafx.scene.input.MouseButton;
import javafx.scene.input.MouseEvent;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;

import java.util.ArrayList;

public class AddToCanvas {
    private static ToolBar toolBar;
    private static Pointer pointerToAdd;
    private static String text;
    private static Font textFont;
    private static int textSize;
    private static Color textColor;
    private static boolean getConnectionPoint;
    private static boolean textToAdd = false;
    private double[] nearestPointToMouse = new double[2];
    private static boolean firstConnectionButton;
    public static PointerCanvas canvas;

    public AddToCanvas(PointerCanvas canvas, ToolBar toolBar) {
        AddToCanvas.canvas = canvas;
        AddToCanvas.toolBar = toolBar;

        canvas.addEventHandler(MouseEvent.MOUSE_MOVED, (MouseEvent event) -> {
            if (pointerToAdd instanceof BasePointer) {
                canvas.drawShapes();
                pointerToAdd.drawArrow(event.getX(), event.getY());
            } else if (pointerToAdd instanceof ExtensionPointer) {

            } else if (getConnectionPoint) {
                ArrayList<double[]> connectionPointArrayList = canvas.getConnectionPoints();
                // calculate distance for every point and save the nearest point
                double nearestDistance = Double.MAX_VALUE;
                for (double[] connectionPoint : connectionPointArrayList) {
                    double distance = Math.sqrt(Math.pow(connectionPoint[0] - event.getX(), 2) + Math.pow(connectionPoint[1] - event.getY(), 2));
                    nearestDistance = Math.min(distance, nearestDistance);
                    if (distance == nearestDistance) {
                        nearestPointToMouse = connectionPoint;
                    }
                }

                canvas.drawShapes();
                double w = 4;
                double h = 4;
                canvas.getGraphicsContext2D().fillOval(nearestPointToMouse[0] - w/2, nearestPointToMouse[1] - h/2, w, h);
            }
        });

        canvas.addEventHandler(MouseEvent.MOUSE_PRESSED, (MouseEvent event) -> {
            AddToCanvas.toolBar.setDisable(false);
            if (event.getButton() == MouseButton.PRIMARY) {
                if(pointerToAdd instanceof BasePointer){
                    pointerToAdd.setX1(event.getX());
                    pointerToAdd.setY1(event.getY());
                    canvas.addShape(new DrawableShape(pointerToAdd));
                    canvas.drawShapes();
                    pointerToAdd = null;
                }
                if(getConnectionPoint){
                    getConnectionPoint = false;
                    canvas.drawShapes();
                    ExtensionPointerAdderWindow.connectionButtonClickedContinue(nearestPointToMouse, firstConnectionButton);
                }
            } else if (event.getButton() == MouseButton.SECONDARY) {
                canvas.drawShapes();
                pointerToAdd = null;
                if(getConnectionPoint){
                    ExtensionPointerAdderWindow.chooseConnectionPointCancelled();
                    getConnectionPoint = false;
                }
            }
        });
    }

    public static void addShape(Pointer pointerToAdd) {
        AddToCanvas.toolBar.setDisable(true);
        AddToCanvas.pointerToAdd = pointerToAdd;
    }

    public static void addText(String text, Font font, int size, Color color) {
        AddToCanvas.toolBar.setDisable(true);
        AddToCanvas.text = text;
        AddToCanvas.textFont = font;
        AddToCanvas.textSize = size;
        AddToCanvas.textColor = color;
        AddToCanvas.textToAdd = true;
    }

    public static void chooseConnectionPoint(boolean firstConnectionButton) {
        AddToCanvas.toolBar.setDisable(true);
        if(firstConnectionButton){
            AddToCanvas.firstConnectionButton = true;
        } else {
            AddToCanvas.firstConnectionButton = false;
        }
        getConnectionPoint = true;
    }
}
