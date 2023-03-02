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

    private GraphicsContext gc;
    private int x1;
    private int y1;
    private int x2;
    private int y2;
    private Color strokeColor;
    private Color fillColor;
    private int ARR_SIZE = 8;
    private int lineWidth = 1;

    public Pointer(GraphicsContext gc, int x1, int y1, int x2, int y2){
        this.gc = gc;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    public Pointer(GraphicsContext gc, int x1, int y1, int x2, int y2, Color strokeColor, Color fillColor) {
        this.gc = gc;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
    }

    public int getARR_SIZE() {
        return ARR_SIZE;
    }

    public void setARR_SIZE(int ARR_SIZE) {
        this.ARR_SIZE = ARR_SIZE;
    }

    public int getLineWidth() {
        return lineWidth;
    }

    public void setLineWidth(int lineWidth) {
        this.lineWidth = lineWidth;
    }

    public GraphicsContext getGc() {
        return gc;
    }

    public void setGc(GraphicsContext gc) {
        this.gc = gc;
    }

    public int getX1() {
        return x1;
    }

    public void setX1(int x1) {
        this.x1 = x1;
    }

    public int getY1() {
        return y1;
    }

    public void setY1(int y1) {
        this.y1 = y1;
    }

    public int getX2() {
        return x2;
    }

    public void setX2(int x2) {
        this.x2 = x2;
    }

    public int getY2() {
        return y2;
    }

    public void setY2(int y2) {
        this.y2 = y2;
    }

    public Color getStrokeColor() {
        return strokeColor;
    }

    public void setStrokeColor(Color strokeColor) {
        this.strokeColor = strokeColor;
    }

    public Color getFillColor() {
        return fillColor;
    }

    public void setFillColor(Color fillColor) {
        this.fillColor = fillColor;
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
    }
}
