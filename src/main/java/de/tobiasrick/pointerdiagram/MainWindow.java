package de.tobiasrick.pointerdiagram;

import de.tobiasrick.pointerdiagram.canvas.AddToCanvas;
import de.tobiasrick.pointerdiagram.canvas.PointerCanvas;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.MenuItem;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.stage.Modality;
import javafx.stage.Stage;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Locale;

import static de.tobiasrick.pointerdiagram.Start.prefs;

public class MainWindow {

    @FXML
    public ToggleGroup languageToggleGroup;
    @FXML
    private MenuItem buttonSwitchToEnglish;

    @FXML
    private MenuItem buttonSwitchToGerman;

    @FXML
    private AnchorPane anchorPane;

    @FXML
    private ScrollPane scrollPane;

    @FXML
    private ToolBar toolBar;

    @FXML
    private PointerCanvas canvas;

    public static Stage addWindow;

    /**
     * initializes the window (custom properties)
     */
    @FXML
    void initialize() {
        new AddToCanvas(canvas, toolBar);

        // load language from settings
        Locale loc = new Locale(prefs.get("language", "en"));
        I18N.setLocale(loc);

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

    @FXML
    void quitButtonClicked() {
        Start.stage.close();
    }

    /**
     * sets the given Locale in the I18N class
     *
     * @param locale the new local to set
     */
    private void switchLanguage(Locale locale) {
        I18N.setLocale(locale);
        prefs.put("language", locale.toString());
    }

    @FXML
    void removePointersButtonClicked() {
        canvas.clearShapes();
    }

    @FXML
    void exportAsPNGButtonClicked() {
        PointerCanvas.saveImage(Start.stage, canvas, "png");
    }

    @FXML
    void copyToClipboardButtonClicked() {
        Color color = showColorPickerPopup("Please pick the background color.");
        if(color != null){
            PointerCanvas.copyImageToClipboard(canvas, color);
        }
    }

    public Color showColorPickerPopup(String prompt) {
        // Create a new stage
        Stage stage = new Stage();
        stage.initModality(Modality.APPLICATION_MODAL);
        //stage.initStyle(StageStyle.TRANSPARENT);

        // Create a label to display the prompt text
        Label label = new Label(prompt);

        // Create a color picker control
        ColorPicker colorPicker = new ColorPicker();

        // Create a button to confirm the color selection
        Button okButton = new Button("OK");
        okButton.setDefaultButton(true);
        okButton.setOnAction(event -> stage.close());

        // Create a button to cancel the color selection
        Button cancelButton = new Button("Cancel");
        cancelButton.setCancelButton(true);
        cancelButton.setOnAction(event -> {
            colorPicker.setValue(null);
            stage.close();
        });

        // Create a HBox to hold the color picker and OK and cancel buttons
        HBox hbox = new HBox(colorPicker, okButton, cancelButton);
        hbox.setAlignment(Pos.CENTER);
        hbox.setSpacing(10);

        // Create a VBox to hold the label and HBox
        VBox vbox = new VBox(label, hbox);
        vbox.setAlignment(Pos.CENTER);
        vbox.setPadding(new Insets(10));
        vbox.setSpacing(10);

        // Set the VBox as the root node of the scene
        Scene scene = new Scene(vbox, Color.TRANSPARENT);
        stage.setScene(scene);

        // Set the stage's background to white
        //stage.getScene().getRoot().setStyle("-fx-background-color: white;");

        // Show the stage and wait for it to be closed
        stage.setResizable(false);
        stage.showAndWait();

        // Return the selected color
        return colorPicker.getValue();
    }



    @FXML
    void openAuthorLink() {
        if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
            try {
                Desktop.getDesktop().browse(new URI("https://tobiasrick.de"));
            } catch (IOException | URISyntaxException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @FXML
    void openGithubLink() {
        if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
            try {
                Desktop.getDesktop().browse(new URI("https://github.com/2Friendly4You/PointerDiagram/"));
            } catch (IOException | URISyntaxException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @FXML
    void addBasePointerButtonClicked() {
        try {
            FXMLLoader fxmlLoader2 = new FXMLLoader(Start.class.getResource("BasePointerAdder.fxml"));
            Parent root1 = fxmlLoader2.load();
            addWindow = new Stage();
            addWindow.setTitle("Add Base Pointer");
            addWindow.setScene(new Scene(root1));
            addWindow.setResizable(false);
            addWindow.centerOnScreen();
            addWindow.initOwner(Start.stage);
            addWindow.initModality(Modality.WINDOW_MODAL);
            addWindow.show();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    @FXML
    void addExtensionPointerButtonClicked() {
        if(canvas.basePointerExists()){
            try {
                FXMLLoader fxmlLoader2 = new FXMLLoader(Start.class.getResource("ExtensionPointerAdder.fxml"));
                Parent root1 = fxmlLoader2.load();
                addWindow = new Stage();
                addWindow.setTitle("Add Extension Pointer");
                addWindow.setScene(new Scene(root1));
                addWindow.setResizable(false);
                addWindow.centerOnScreen();
                addWindow.initOwner(Start.stage);
                addWindow.initModality(Modality.WINDOW_MODAL);
                addWindow.show();
            }
            catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @FXML
    void addTextButtonClicked() {
        try {
            FXMLLoader fxmlLoader2 = new FXMLLoader(Start.class.getResource("TextAdder.fxml"));
            Parent root1 = fxmlLoader2.load();
            addWindow = new Stage();
            addWindow.setTitle("Add text");
            addWindow.setScene(new Scene(root1));
            addWindow.setResizable(false);
            addWindow.centerOnScreen();
            addWindow.initOwner(Start.stage);
            addWindow.initModality(Modality.WINDOW_MODAL);
            addWindow.show();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }
}