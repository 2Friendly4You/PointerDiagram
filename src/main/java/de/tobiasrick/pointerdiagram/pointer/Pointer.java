package de.tobiasrick.pointerdiagram.pointer;

import javafx.scene.canvas.GraphicsContext;
import javafx.scene.paint.Color;
import javafx.scene.transform.Affine;
import javafx.scene.transform.Transform;

/**
 * A class that represents a pointer
 *
 * @author Tobias Rick
 */
public abstract class Pointer {

    private final GraphicsContext gc;
    private double x1;
    private double y1;
    private double x2;
    private double y2;
    private Color strokeColor;
    private Color fillColor;
    private final int ARR_SIZE = 8;
    private final int lineWidth = 1;
    private double length;

    public Pointer(GraphicsContext gc, double x1, double y1, double x2, double y2){
        this.gc = gc;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    public Pointer(GraphicsContext gc, double x1, double y1, double x2, double y2, Color strokeColor, Color fillColor) {
        this.gc = gc;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
    }

    public Pointer(GraphicsContext gc, double length, Color strokeColor, Color fillColor) {
        this.gc = gc;
        this.length = length;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
    }

    public int getARR_SIZE() {
        return ARR_SIZE;
    }

    public int getLineWidth() {
        return lineWidth;
    }

    public GraphicsContext getGc() {
        return gc;
    }

    public double getX1() {
        return x1;
    }

    public void setX1(double x1) {
        this.x1 = x1;
    }

    public double getY1() {
        return y1;
    }

    public void setY1(double y1) {
        this.y1 = y1;
    }

    public double getX2() {
        return x2;
    }

    public double getY2() {
        return y2;
    }

    public Color getStrokeColor() {
        return strokeColor;
    }

    public Color getFillColor() {
        return fillColor;
    }

    /**
     * draws the arrow on the canvas
     */
    public void drawArrow() {
        gc.setStroke(strokeColor);
        gc.setFill(fillColor);
        gc.setLineWidth(lineWidth);

        double dx = x2 - x1, dy = y2 - y1;
        double angle = Math.atan2(dy, dx);
        int len = (int) Math.sqrt(dx * dx + dy * dy);

        Transform transform = Transform.translate(x1, y1);
        transform = transform.createConcatenation(Transform.rotate(Math.toDegrees(angle), 0, 0));
        gc.setTransform(new Affine(transform));

        gc.strokeLine(0, 0, len, 0);
        gc.fillPolygon(new double[]{len, len - ARR_SIZE, len - ARR_SIZE, len}, new double[]{0, -ARR_SIZE, ARR_SIZE, 0},
                4);
        gc.setTransform(new Affine(Transform.rotate(0,0,0)));
        gc.setTransform(new Affine());
    }

    public void drawArrow(double x1, double y1) {
        x2 = length + x1;
        y2 = y1;

        gc.setStroke(strokeColor);
        gc.setFill(fillColor);
        gc.setLineWidth(lineWidth);

        double dx = x2 - x1, dy = y2 - y1;
        double angle = Math.atan2(dy, dx);
        int len = (int) Math.sqrt(dx * dx + dy * dy);

        Transform transform = Transform.translate(x1, y1);
        transform = transform.createConcatenation(Transform.rotate(Math.toDegrees(angle), 0, 0));
        gc.setTransform(new Affine(transform));

        gc.strokeLine(0, 0, len, 0);
        gc.fillPolygon(new double[]{len, len - ARR_SIZE, len - ARR_SIZE, len}, new double[]{0, -ARR_SIZE, ARR_SIZE, 0},
                4);
        gc.setTransform(new Affine(Transform.rotate(0,0,0)));
        gc.setTransform(new Affine());
    }
}
