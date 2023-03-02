package de.tobiasrick.pointerdiagram;

import javafx.fxml.FXML;
import javafx.scene.control.MenuItem;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.AnchorPane;

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
    void quitButtonClicked() {
        Start.stage.close();
    }

    /**
     * initializes the window (custom properties)
     */
    @FXML
    void initialize() {
        // multilanguage text for buttons is configured
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
}