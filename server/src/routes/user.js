// Importieren der erforderlichen Module
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Erstellen eines neuen Express-Routers
const router = express.Router();

// Importieren des User-Models
import {UserModel} from "../models/Users.js";

// Route für die Registrierung eines neuen Benutzers
router.post("/register", async (req, res) => {
    const {username, password} = req.body; // Auslesen von Benutzername und Passwort aus der Anfrage

    // Prüfen, ob der Benutzername bereits in der Datenbank existiert
    const user = await UserModel.findOne({username});
    if (user) {
        // Wenn der Benutzername bereits existiert, sende einen Fehlerstatus
        return res.status(400).json({message: "Username already exists"});
    }

    // Wenn der Benutzername noch nicht existiert, erstelle ein neues Benutzerobjekt
    // Hashen des Passworts vor dem Speichern in der Datenbank
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({username, password: hashedPassword});

    // Speichern des neuen Benutzers in der Datenbank
    await newUser.save();
    res.json({message: "User registered successfully"}); // Rückmeldung, dass die Registrierung erfolgreich war
});

// Route für das Einloggen eines Benutzers
router.post("/login", async (req, res) => {
    const {username, password} = req.body; // Auslesen von Benutzername und Passwort aus der Anfrage

    // Suche nach dem Benutzer in der Datenbank
    const user = await UserModel.findOne({username});

    // Wenn der Benutzer nicht gefunden wurde oder das Passwort nicht stimmt, sende einen Fehlerstatus
    if (!user) {
        return res
            .status(400)
            .json({message: "Username or password is incorrect"});
    }

    // Prüfung, ob das eingegebene Passwort mit dem in der Datenbank übereinstimmt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res
            .status(400)
            .json({message: "Username or password is incorrect"});
    }

    // Wenn das Passwort korrekt ist, erstelle ein neues JWT (JSON Web Token)
    const token = jwt.sign({id: user._id}, "secret");

    // Senden des Tokens und der Benutzer-ID als Antwort
    res.json({token, userID: user._id});
});

// Exportieren des Routers
export {router as userRouter};

// Funktion zur Überprüfung des JWTs
export const verifyToken = (req, res, next) => {
    // Auslesen des Authentifizierungs-Headers
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // Überprüfen des Tokens
        jwt.verify(authHeader, "secret", (err) => {
            // Wenn der Token ungültig ist, sende einen Statuscode 403 (Zugriff verweigert)
            if (err) {
                return res.sendStatus(403);
            }

            // Wenn der Token gültig ist, führe die nächste Middleware-Funktion aus
            next();
        });
    } else {
        // Wenn kein Token gesendet wurde, sende einen Statuscode 401 (nicht autorisiert)
        res.sendStatus(401);
    }
};
