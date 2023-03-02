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

    @FXML
    void initialize() {
        buttonSwitchToEnglish.textProperty().bind(I18N.createStringBinding("button.languageSwitchToEnglish"));
        buttonSwitchToGerman.textProperty().bind(I18N.createStringBinding("button.languageSwitchToGerman"));

        scrollPane.setFitToHeight(true);
        scrollPane.setFitToWidth(true);

        anchorPane.widthProperty().addListener((observable, oldValue, newValue) -> resizeScrollPane(true, newValue));

        anchorPane.heightProperty().addListener((observable, oldValue, newValue) -> resizeScrollPane(false, newValue));

        scrollPane.viewportBoundsProperty().addListener((observable, oldValue, newValue) -> {
            double height = anchorPane.getHeight();
            double width = anchorPane.getWidth();
            scrollPane.setPrefHeight(height);
            scrollPane.setPrefWidth(width);
        });
    }

    @FXML
    void switchToEnglish() {
        switchLanguage(Locale.ENGLISH);
    }

    @FXML
    void switchToGerman() {
        switchLanguage(Locale.GERMAN);
    }

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
    }
}