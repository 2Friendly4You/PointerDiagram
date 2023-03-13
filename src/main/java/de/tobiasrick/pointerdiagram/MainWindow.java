package de.tobiasrick.pointerdiagram;

import de.tobiasrick.pointerdiagram.canvas.AddToCanvas;
import de.tobiasrick.pointerdiagram.canvas.PointerCanvas;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.MenuItem;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Modality;
import javafx.stage.Stage;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Locale;

public class MainWindow {

    @FXML
    private MenuItem buttonSwitchToEnglish;

    @FXML
    private MenuItem buttonSwitchToGerman;

    @FXML
    private AnchorPane anchorPane;

    @FXML
    private ScrollPane scrollPane;

    @FXML
    private PointerCanvas canvas;

    @FXML
    void quitButtonClicked() {
        Start.stage.close();
    }

    public static Stage addPointerWindow;

    /**
     * initializes the window (custom properties)
     */
    @FXML
    void initialize() {
        new AddToCanvas(canvas);

        // multi-language text for buttons is configured
        buttonSwitchToEnglish.textProperty().bind(I18N.createStringBinding("button.languageSwitchToEnglish"));
        buttonSwitchToGerman.textProperty().bind(I18N.createStringBinding("button.languageSwitchToGerman"));

        // scrollPane is set to fit the window
        scrollPane.setFitToHeight(true);
        scrollPane.setFitToWidth(true);

        // a listener is added to the anchor pane to see, if the window got resized. The scrollPane will be resized to anchorpane size
        anchorPane.widthProperty().addListener((observable, oldValue, newValue) -> resizeScrollPane(true, newValue));
        anchorPane.heightProperty().addListener((observable, oldValue, newValue) -> resizeScrollPane(false, newValue));

        // set the size for the first time the program starts
        scrollPane.viewportBoundsProperty().addListener((observable, oldValue, newValue) -> {
            double height = anchorPane.getHeight();
            double width = anchorPane.getWidth();
            scrollPane.setPrefHeight(height);
            scrollPane.setPrefWidth(width);
        });
    }

    /**
     * switch language to english
     */
    @FXML
    void switchToEnglish() {
        switchLanguage(Locale.ENGLISH);
    }

    /**
     * switch language to german
     */
    @FXML
    void switchToGerman() {
        switchLanguage(Locale.GERMAN);
    }

    /**
     * resizes the scrollpane to given value
     *
     * @param width should width be used? if false, height is used
     * @param newValue the value, the width/ height should be resized to
     */
    private void resizeScrollPane(Boolean width, Number newValue) {
        if (width) {
            scrollPane.setPrefWidth((Double) newValue);
        } else {
            scrollPane.setPrefHeight((Double) newValue);
        }
    }

    /**
     * sets the given Locale in the I18N class
     *
     * @param locale the new local to set
     */
    private void switchLanguage(Locale locale) {
        I18N.setLocale(locale);
        Start.prefs.put("language", locale.toString());
    }

    @FXML
    void removePointersButtonClicked(ActionEvent event) {
        canvas.clearShapes();
    }

    @FXML
    void openAuthorLink(ActionEvent event) {
        if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
            try {
                Desktop.getDesktop().browse(new URI("https://tobiasrick.de"));
            } catch (IOException | URISyntaxException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @FXML
    void openGithubLink(ActionEvent event) {
        if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
            try {
                Desktop.getDesktop().browse(new URI("https://github.com/2Friendly4You/PointerDiagram/"));
            } catch (IOException | URISyntaxException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @FXML
    void addBasePointerButtonClicked(ActionEvent event) {
        try {
            FXMLLoader fxmlLoader2 = new FXMLLoader(Start.class.getResource("BasePointerAdder.fxml"));
            Parent root1 = fxmlLoader2.load();
            addPointerWindow = new Stage();
            addPointerWindow.setTitle("Add Base Pointer");
            addPointerWindow.setScene(new Scene(root1));
            addPointerWindow.setResizable(false);
            addPointerWindow.centerOnScreen();
            addPointerWindow.initOwner(Start.stage);
            addPointerWindow.initModality(Modality.WINDOW_MODAL);
            addPointerWindow.show();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    @FXML
    void addExtensionPointerButtonClicked(ActionEvent event) {
        if(canvas.basePointerExists()){
            try {
                FXMLLoader fxmlLoader2 = new FXMLLoader(Start.class.getResource("ExtensionPointerAdder.fxml"));
                Parent root1 = fxmlLoader2.load();
                addPointerWindow = new Stage();
                addPointerWindow.setTitle("Add Extension Pointer");
                addPointerWindow.setScene(new Scene(root1));
                addPointerWindow.setResizable(false);
                addPointerWindow.centerOnScreen();
                addPointerWindow.initOwner(Start.stage);
                addPointerWindow.initModality(Modality.WINDOW_MODAL);
                addPointerWindow.show();
            }
            catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}